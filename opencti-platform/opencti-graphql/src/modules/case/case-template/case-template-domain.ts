import { type EntityOptions, listEntitiesPaginated, storeLoadById } from '../../../database/middleware-loader';
import { type BasicStoreEntityCaseTemplate, ENTITY_TYPE_CASE_TEMPLATE, TEMPLATE_TASK_RELATION } from './case-template-types';
import type { CaseTemplateAddInput, EditInput, StixRefRelationshipAddInput } from '../../../generated/graphql';
import type { DomainFindById } from '../../../domain/domainTypes';
import type { AuthContext, AuthUser } from '../../../types/user';
import { batchListThroughGetTo, createEntity, deleteElementById, updateAttribute } from '../../../database/middleware';
import { notify } from '../../../database/redis';
import { BUS_TOPICS } from '../../../config/conf';
import { ABSTRACT_INTERNAL_OBJECT } from '../../../schema/general';
import { publishUserAction } from '../../../listener/UserActionListener';
import { stixObjectOrRelationshipAddRefRelation, stixObjectOrRelationshipDeleteRefRelation } from '../../../domain/stixObjectOrStixRelationship';
import { extractEntityRepresentativeName } from '../../../database/entity-representative';
import { ENTITY_TYPE_TASK_TEMPLATE } from '../../task/task-template/task-template-types';

export const findById: DomainFindById<BasicStoreEntityCaseTemplate> = (context: AuthContext, user: AuthUser, templateId: string) => {
  return storeLoadById(context, user, templateId, ENTITY_TYPE_CASE_TEMPLATE);
};
export const findAll = (context: AuthContext, user: AuthUser, opts: EntityOptions<BasicStoreEntityCaseTemplate>) => {
  return listEntitiesPaginated<BasicStoreEntityCaseTemplate>(context, user, [ENTITY_TYPE_CASE_TEMPLATE], opts);
};
export const batchTasks = async (context: AuthContext, user: AuthUser, templateIds: string[]) => {
  return batchListThroughGetTo(context, user, templateIds, TEMPLATE_TASK_RELATION, ENTITY_TYPE_TASK_TEMPLATE);
};

export const caseTemplateAdd = async (context: AuthContext, user: AuthUser, input: CaseTemplateAddInput) => {
  const created = await createEntity(context, user, input, ENTITY_TYPE_CASE_TEMPLATE);
  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'create',
    event_access: 'administration',
    message: `creates case template \`${input.name}\``,
    context_data: { id: created.id, entity_type: ENTITY_TYPE_CASE_TEMPLATE, input }
  });
  return notify(BUS_TOPICS[ABSTRACT_INTERNAL_OBJECT].ADDED_TOPIC, created, user);
};
export const caseTemplateDelete = async (context: AuthContext, user: AuthUser, caseTemplateId: string) => {
  const element = await deleteElementById(context, user, caseTemplateId, ENTITY_TYPE_CASE_TEMPLATE);
  await notify(BUS_TOPICS[ABSTRACT_INTERNAL_OBJECT].DELETE_TOPIC, element, user);
  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'delete',
    event_access: 'administration',
    message: `deletes case template \`${element.name}\``,
    context_data: { id: caseTemplateId, entity_type: ENTITY_TYPE_CASE_TEMPLATE, input: element }
  });
  return caseTemplateId;
};
export const caseTemplateEdit = async (context: AuthContext, user: AuthUser, caseTemplateId: string, input: EditInput[]) => {
  const { element: updatedElem } = await updateAttribute(context, user, caseTemplateId, ENTITY_TYPE_CASE_TEMPLATE, input);
  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'update',
    event_access: 'administration',
    message: `updates \`${input.map((i) => i.key).join(', ')}\` for case template \`${updatedElem.name}\``,
    context_data: { id: caseTemplateId, entity_type: ENTITY_TYPE_CASE_TEMPLATE, input }
  });
  return notify(BUS_TOPICS[ABSTRACT_INTERNAL_OBJECT].EDIT_TOPIC, updatedElem, user);
};
export const caseTemplateAddRelation = async (context: AuthContext, user: AuthUser, caseTemplateId: string, input: StixRefRelationshipAddInput) => {
  const relation = await stixObjectOrRelationshipAddRefRelation(context, user, caseTemplateId, input, ABSTRACT_INTERNAL_OBJECT);
  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'update',
    event_access: 'administration',
    message: `adds Task template \`${extractEntityRepresentativeName(relation.from)}\` for case template \`${relation.to.name}\``,
    context_data: { id: caseTemplateId, entity_type: ENTITY_TYPE_CASE_TEMPLATE, input }
  });
  return relation.to;
};
export const caseTemplateDeleteRelation = async (context: AuthContext, user: AuthUser, caseTemplateId: string, toId: string, relationshipType: string) => {
  const relation = await stixObjectOrRelationshipDeleteRefRelation(context, user, caseTemplateId, toId, relationshipType, ABSTRACT_INTERNAL_OBJECT);
  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'delete',
    event_access: 'administration',
    message: `removes Task template \`${extractEntityRepresentativeName(relation.from)}\` for case template \`${relation.to.name}\``,
    context_data: { id: caseTemplateId, entity_type: ENTITY_TYPE_CASE_TEMPLATE, input: { caseTemplateId, toId, relationshipType } }
  });
  return relation.to;
};
