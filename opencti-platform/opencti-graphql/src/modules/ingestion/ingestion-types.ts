import type { StixObject, StixOpenctiExtensionSDO } from '../../types/stix-common';
import { STIX_EXT_OCTI } from '../../types/stix-extensions';
import type { StoreEntity, BasicStoreEntity } from '../../types/store';

// region Rss ingestion
export const ENTITY_TYPE_INGESTION_RSS = 'IngestionRss';

export interface BasicStoreEntityIngestionRss extends BasicStoreEntity {
  name: string
  description: string
  uri: string
  user_id: string | undefined
  created_by_ref: string | undefined
  report_types: string[]
  object_marking_refs: string[] | undefined
  current_state_date: Date | undefined
  ingestion_running: boolean
}

export interface StoreEntityIngestionRss extends StoreEntity {
  name: string
  description: string
  uri: string
  report_types: string[]
  ingestion_running: boolean
}

export interface StixIngestionRss extends StixObject {
  name: string
  description: string
  uri: string
  report_types: string[]
  ingestion_running: boolean
  extensions: {
    [STIX_EXT_OCTI]: StixOpenctiExtensionSDO
  }
}
// endregion

// region Taxii ingestion
export const ENTITY_TYPE_INGESTION_TAXII = 'IngestionTaxii';

export interface BasicStoreEntityIngestionTaxii extends BasicStoreEntity {
  name: string
  description: string
  uri: string
  version: string
  collection: string
  authentication_type: 'none' | 'basic' | 'bearer' | 'certificate'
  authentication_value: string
  user_id: string | undefined
  added_after_start: Date | undefined
  current_state_cursor: string | undefined
  ingestion_running: boolean
}

export interface StoreEntityIngestionTaxii extends StoreEntity {
  name: string
  description: string
  uri: string
  ingestion_running: boolean
}

export interface StixIngestionTaxii extends StixObject {
  name: string
  description: string
  uri: string
  ingestion_running: boolean
  extensions: {
    [STIX_EXT_OCTI]: StixOpenctiExtensionSDO
  }
}
// endregion

// region Csv ingestion
export const ENTITY_TYPE_INGESTION_CSV = 'IngestionCsv';

export interface BasicStoreEntityIngestionCsv extends BasicStoreEntity {
  name: string
  description: string
  uri: string
  csvMapper: string[]
  authentication_type: 'none' | 'basic' | 'bearer' | 'certificate'
  authentication_value: string
  user_id: string | undefined
  ingestion_running: boolean
}

export interface StoreEntityIngestionCsv extends StoreEntity {
  name: string
  description: string
  uri: string
  csvMapper: string[]
  ingestion_running: boolean
}

export interface StixIngestionCsv extends StixObject {
  name: string
  description: string
  uri: string
  csvMapper: string[]
  ingestion_running: boolean
  extensions: {
    [STIX_EXT_OCTI]: StixOpenctiExtensionSDO
  }
}
// endregion
