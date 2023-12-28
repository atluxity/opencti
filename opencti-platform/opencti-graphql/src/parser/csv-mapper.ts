/* eslint-disable no-param-reassign */
import moment from 'moment';
import type { AttributeDefinition, AttrType, } from '../schema/attribute-definition';
import { entityType, relationshipType, standardId } from '../schema/attribute-definition';
import { generateStandardId } from '../schema/identifier';
import { schemaAttributesDefinition } from '../schema/schema-attributes';
import { isEmptyField, isNotEmptyField } from '../database/utils';
import { schemaRelationsRefDefinition } from '../schema/schema-relationsRef';
import { handleInnerType } from '../domain/stixDomainObject';
import { columnNameToIdx } from './csv-helper';
import { isStixRelationshipExceptRef } from '../schema/stixRelationship';
import type { BasicStoreEntityCsvMapper, CsvMapperRepresentation } from '../modules/internal/csvMapper/csvMapper-types';
import { CsvMapperRepresentationType, Operator } from '../modules/internal/csvMapper/csvMapper-types';
import type { AttributeColumn } from '../generated/graphql';
import { isValidTargetType } from '../modules/internal/csvMapper/csvMapper-utils';
import { fillDefaultValues, getEntitySettingFromCache } from '../modules/entitySetting/entitySetting-utils';
import type { AuthContext } from '../types/user';
import { UnsupportedError } from '../config/errors';

export type InputType = string | string[] | boolean | number | Record<string, any>;

// -- HANDLE VALUE --

const formatValue = (value: string, type: AttrType, column: AttributeColumn) => {
  const pattern_date = column.configuration?.pattern_date;
  const timezone = column.configuration?.timezone;
  if (type === 'string') {
    return value.trim();
  }
  if (type === 'numeric') {
    const formattedValue = Number(value);
    return Number.isNaN(formattedValue) ? null : formattedValue;
  }
  if (type === 'date') {
    try {
      moment.suppressDeprecationWarnings = true;
      if (isNotEmptyField(pattern_date)) {
        if (isNotEmptyField(timezone)) {
          return moment(value, pattern_date as string, timezone as string).toISOString();
        }
        return moment(value, pattern_date as string).toISOString();
      }
      return moment(value).toISOString();
    } catch (error: any) {
      return null;
    }
  }
  if (type === 'boolean') {
    const stringBoolean = value.toLowerCase().trim();
    // TODO Matching value must be configurable in parser option
    return stringBoolean === 'true' || stringBoolean === 'yes' || stringBoolean === '1';
  }
  return value;
};

const computeValue = (value: string, column: AttributeColumn, attributeDef: AttributeDefinition) => {
  if (isEmptyField(value)) {
    return null;
  }
  // Handle multiple
  if (attributeDef.multiple ?? false) {
    if (column.configuration?.separator) {
      return value.split(column.configuration.separator).map((v) => formatValue(v, attributeDef.type, column));
    }
    return [formatValue(value, attributeDef.type, column)];
  }
  // Handle single
  return formatValue(value, attributeDef.type, column);
};

const extractValueFromCsv = (record: string[], columnName: string) => {
  const idx = columnNameToIdx(columnName); // Handle letter to idx here & remove headers
  if (isEmptyField(idx)) {
    throw UnsupportedError('Unknown column name', { name: columnName });
  } else {
    return record[idx as number];
  }
};

// -- VALIDATION --

const isValidTarget = (record: string[], representation: CsvMapperRepresentation) => {
  // Target type
  isValidTargetType(representation);

  // Column based
  const columnBased = representation.target.column_based;
  if (columnBased) {
    const recordValue = extractValueFromCsv(record, columnBased.column_reference);
    if (columnBased.operator === Operator.eq) {
      return recordValue === columnBased.value;
    } if (columnBased.operator === Operator.neq) {
      return recordValue !== columnBased.value;
    }
    return false;
  }
  return true;
};

const isValidInput = (input: Record<string, InputType>) => {
  // Verify from and to are filled for relationship
  if (isStixRelationshipExceptRef(input[entityType.name] as string)) {
    if (isEmptyField(input.from) || isEmptyField(input.to)) {
      return false;
    }
  }

  // Verify mandatory attributes are filled
  // TODO: Removed it when it will be handle in schema-validator
  const mandatoryAttributes = Array.from(schemaAttributesDefinition.getAttributes(input[entityType.name] as string).values())
    .filter((attr) => attr.mandatoryType === 'external')
    .map((attr) => attr.name);
  const mandatoryRefs = schemaRelationsRefDefinition.getRelationsRef(input[entityType.name] as string)
    .filter((ref) => ref.mandatoryType === 'external')
    .map((ref) => ref.inputName);

  return [...mandatoryAttributes, ...mandatoryRefs].every((key) => isNotEmptyField(input[key]));
};

// -- COMPUTE --

const handleType = (representation: CsvMapperRepresentation, input: Record<string, InputType>) => {
  const { entity_type } = representation.target;
  input[entityType.name] = entity_type;
  if (representation.type === CsvMapperRepresentationType.relationship) {
    input[relationshipType.name] = entity_type;
  }
};
const handleId = (representation: CsvMapperRepresentation, input: Record<string, InputType>) => {
  input[standardId.name] = generateStandardId(representation.target.entity_type, input);
};

const handleDirectAttribute = (attributeKey: string, column: AttributeColumn, input: Record<string, InputType>, value: string) => {
  const entity_type = input[entityType.name] as string;
  const attributeDef = schemaAttributesDefinition.getAttribute(entity_type, attributeKey);
  if (!attributeDef) {
    throw UnsupportedError('Invalid attribute', { key: attributeKey, type: entity_type });
  }
  const computedValue = computeValue(value, column, attributeDef);
  if (computedValue !== null && computedValue !== undefined) {
    input[attributeKey] = computedValue;
  }
};
const handleBasedOnAttribute = (attributeKey: string, input: Record<string, InputType>, entities: Record<string, InputType>[]) => {
  const entity_type = input[entityType.name] as string;
  // Is relation from or to (stix-core || stix-sighting)
  if (isStixRelationshipExceptRef(entity_type) && (['from', 'to'].includes(attributeKey))) {
    if (attributeKey === 'from') {
      const entity = entities[0];
      if (isNotEmptyField(entity)) {
        input.from = entity;
        input.fromType = entity[entityType.name];
      }
    } else if (attributeKey === 'to') {
      const entity = entities[0];
      if (isNotEmptyField(entity)) {
        input.to = entity;
        input.toType = entity[entityType.name];
      }
    }
  // Is relation ref
  } else {
    const relationDef = schemaRelationsRefDefinition.getRelationRef(entity_type, attributeKey);
    if (!relationDef) {
      throw UnsupportedError('Invalid attribute', { key: attributeKey, type: entity_type });
    } else {
      input[attributeKey] = relationDef.multiple ? entities : entities[0];
    }
  }
};

const handleAttributes = (record: string[], representation: CsvMapperRepresentation, input: Record<string, InputType>, map: Map<string, Record<string, InputType>>) => {
  const attributes = representation.attributes ?? [];
  attributes.forEach((attribute) => {
    // Handle column attribute
    if (attribute.column) {
      let recordValue;
      if (isNotEmptyField(attribute.column?.column_name)) {
        const { column } = attribute;
        recordValue = extractValueFromCsv(record, column.column_name);
      }
      if (recordValue) {
        handleDirectAttribute(attribute.key, attribute.column, input, recordValue);
      }
      if (!recordValue && attribute.default_values !== undefined) {
        input[attribute.key] = attribute.default_values;
      }
      // Handle based_on attribute
    } else if (attribute.based_on) {
      const basedOn = attribute.based_on;
      const entities = basedOn.representations?.map((based) => map.get(based));
      if (isEmptyField(entities)) {
        throw UnsupportedError('Unknown value(s)', { key: attribute.key });
      } else {
        const definedEntities = entities?.filter((e) => e !== undefined) as Record<string, InputType>[];
        handleBasedOnAttribute(attribute.key, input, definedEntities);
      }
    }
  });
};

const mapRecord = async (context: AuthContext, record: string[], representation: CsvMapperRepresentation, map: Map<string, Record<string, InputType>>) => {
  if (!isValidTarget(record, representation)) {
    return null;
  }
  const { entity_type } = representation.target;

  let input: Record<string, InputType> = {};
  handleType(representation, input);
  input = handleInnerType(input, entity_type);

  handleAttributes(record, representation, input, map);

  const entitySetting = await getEntitySettingFromCache(context, entity_type);
  const filledInput = fillDefaultValues(context.user, input, entitySetting);

  if (!isValidInput(filledInput)) {
    return null;
  }
  handleId(representation, filledInput);

  return filledInput;
};

export const mappingProcess = async (
  context: AuthContext,
  mapper: BasicStoreEntityCsvMapper,
  record: string[]
): Promise<Record<string, InputType>[]> => {
  const { representations } = mapper;
  const representationEntities = representations
    .filter((r) => r.type === CsvMapperRepresentationType.entity)
    .sort((r1, r2) => r1.attributes.filter((attr) => attr.based_on).length - r2.attributes.filter((attr) => attr.based_on).length);
  const representationRelationships = representations.filter((r) => r.type === CsvMapperRepresentationType.relationship);
  const results = new Map<string, Record<string, InputType>>();

  // 1. entities sort by no based on at first
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < representationEntities.length; i++) {
    const representation = representationEntities[i];
    const input = await mapRecord(context, record, representation, results);
    if (input) {
      results.set(representation.id, input);
    }
  }

  // 2. relationships
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < representationRelationships.length; i++) {
    const representation = representationRelationships[i];
    const input = await mapRecord(context, record, representation, results);
    if (input) {
      results.set(representation.id, input);
    }
  }

  return Array.from(results.values());
};
