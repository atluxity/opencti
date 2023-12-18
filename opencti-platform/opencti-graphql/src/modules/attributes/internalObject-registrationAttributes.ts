import * as R from 'ramda';
import { type AttributeDefinition, authorizedMembers } from '../../schema/attribute-definition';
import { errors, id } from '../../schema/attribute-definition';
import { schemaAttributesDefinition } from '../../schema/schema-attributes';
import {
  ENTITY_TYPE_CAPABILITY,
  ENTITY_TYPE_CONNECTOR,
  ENTITY_TYPE_GROUP,
  ENTITY_TYPE_MIGRATION_REFERENCE,
  ENTITY_TYPE_MIGRATION_STATUS,
  ENTITY_TYPE_RETENTION_RULE,
  ENTITY_TYPE_ROLE,
  ENTITY_TYPE_RULE,
  ENTITY_TYPE_RULE_MANAGER,
  ENTITY_TYPE_SETTINGS,
  ENTITY_TYPE_STATUS,
  ENTITY_TYPE_STATUS_TEMPLATE,
  ENTITY_TYPE_STREAM_COLLECTION,
  ENTITY_TYPE_SYNC,
  ENTITY_TYPE_BACKGROUND_TASK,
  ENTITY_TYPE_TAXII_COLLECTION,
  ENTITY_TYPE_USER,
  ENTITY_TYPE_FEED,
  ENTITY_TYPE_HISTORY,
  ENTITY_TYPE_ACTIVITY,
  ENTITY_TYPE_WORK
} from '../../schema/internalObject';
import { settingsMessages } from '../../domain/settings';

const HistoryDefinition: AttributeDefinition[] = [
  { name: 'event_type', type: 'string', mandatoryType: 'internal', multiple: false, upsert: false },
  { name: 'event_status', type: 'string', mandatoryType: 'internal', multiple: false, upsert: false },
  { name: 'event_access', type: 'string', mandatoryType: 'internal', multiple: false, upsert: false },
  { name: 'event_scope', type: 'string', mandatoryType: 'internal', multiple: false, upsert: false },
  { name: 'user_id', type: 'string', mandatoryType: 'internal', multiple: false, upsert: false },
  { name: 'applicant_id', type: 'string', mandatoryType: 'no', multiple: false, upsert: false },
  { name: 'group_ids', type: 'string', mandatoryType: 'internal', multiple: true, upsert: false },
  { name: 'organization_ids', type: 'string', mandatoryType: 'internal', multiple: true, upsert: false },
  { name: 'timestamp', type: 'date', mandatoryType: 'internal', multiple: false, upsert: false },
  {
    name: 'context_data',
    type: 'object',
    mandatoryType: 'internal',
    multiple: false,
    upsert: false,
    mappings: [
      id,
      { name: 'provider', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'username', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'message', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'element_id', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'entity_type', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'path', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'format', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'operation', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'entity_name', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'export_scope', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'export_type', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'file_id', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'file_name', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'file_mime', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'max_marking', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'connectors', type: 'string', mandatoryType: 'no', multiple: true, upsert: true },
      { name: 'selected_ids', type: 'string', mandatoryType: 'no', multiple: true, upsert: true },
      { name: 'connector_name', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'created_by_id', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'marking_definition_ids', type: 'string', mandatoryType: 'no', multiple: true, upsert: true },
      { name: 'labels_ids', type: 'string', mandatoryType: 'no', multiple: true, upsert: true },
      { name: 'types', type: 'string', mandatoryType: 'no', multiple: true, upsert: true },
      { name: 'search', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'filters', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'list_params', type: 'object_flat', mandatoryType: 'no', multiple: false, upsert: true },
      { name: 'input', type: 'object_flat', mandatoryType: 'no', multiple: false, upsert: true },
    ]
  },
];

const internalObjectsAttributes: { [k: string]: AttributeDefinition[] } = {
  [ENTITY_TYPE_SETTINGS]: [
    { name: 'platform_title', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_organization', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_favicon', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_email', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_background', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_paper', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_nav', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_primary', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_secondary', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_accent', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_logo', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_logo_collapsed', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_dark_logo_login', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_background', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_paper', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_nav', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_primary', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_secondary', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_accent', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_logo', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_logo_collapsed', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_theme_light_logo_login', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_language', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_login_message', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_consent_message', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_consent_confirm_text', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_banner_text', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_banner_level', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'otp_mandatory', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'password_policy_min_length', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'password_policy_max_length', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'password_policy_min_numbers', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'password_policy_min_symbols', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'password_policy_min_words', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'password_policy_min_lowercase', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'password_policy_min_uppercase', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platform_whitemark', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'enterprise_edition', type: 'date', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'activity_listeners_ids', type: 'string', mandatoryType: 'no', editDefault: false, multiple: true, upsert: false },
    { name: 'platform_messages', type: 'json', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false, schemaDef: settingsMessages },
    { name: 'analytics_google_analytics_v4', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_MIGRATION_STATUS]: [
    { name: 'lastRun', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'platformVersion', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false }
  ],
  [ENTITY_TYPE_MIGRATION_REFERENCE]: [
    { name: 'title', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'timestamp', type: 'date', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false }
  ],
  [ENTITY_TYPE_GROUP]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'description', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: true },
    { name: 'default_assignation', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'auto_new_marking', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'default_marking',
      type: 'object',
      mandatoryType: 'no',
      editDefault: false,
      multiple: true,
      upsert: false,
      mappings: [
        { name: 'entity_type', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
        { name: 'values', type: 'string', mandatoryType: 'no', multiple: true, upsert: true },
      ]
    },
    { name: 'default_dashboard', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: true },
    { name: 'default_hidden_types', type: 'string', mandatoryType: 'no', editDefault: false, multiple: true, upsert: false },
  ],
  [ENTITY_TYPE_USER]: [
    { name: 'user_email', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'password', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'description', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'firstname', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'lastname', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'theme', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'language', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'external', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'bookmarks',
      type: 'object',
      mandatoryType: 'no',
      editDefault: false,
      multiple: true,
      upsert: false,
      mappings: [
        { name: 'id:', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
        { name: 'type', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      ]
    },
    { name: 'api_token', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'otp_secret', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'otp_qr', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'otp_activated', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'default_dashboard', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'default_time_field', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'account_status', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'account_lock_after_date', type: 'date', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'administrated_organizations', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'unit_system', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_ROLE]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'description', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_RULE]: [
    { name: 'active', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: true }
  ],
  [ENTITY_TYPE_RULE_MANAGER]: [
    { name: 'lastEventId', type: 'string', mandatoryType: 'no', multiple: false, upsert: false },
    errors
  ],
  [ENTITY_TYPE_CAPABILITY]: [
    { name: 'name', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'attribute_order', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'description', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_CONNECTOR]: [
    { name: 'name', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'active', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'auto', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'only_contextual', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'connector_type', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'connector_scope', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'connector_state', type: 'json', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'connector_state_reset', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'connector_user_id', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'playbook_compatible', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_TAXII_COLLECTION]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'description', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: true },
    { name: 'filters', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'taxii_public', type: 'boolean', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    authorizedMembers
  ],
  [ENTITY_TYPE_FEED]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'description', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'filters', type: 'json', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'separator', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'rolling_time', type: 'numeric', precision: 'long', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'include_header', type: 'boolean', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'feed_public', type: 'boolean', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'feed_types', type: 'string', mandatoryType: 'external', editDefault: true, multiple: true, upsert: false },
    { name: 'feed_date_attribute', type: 'date', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    {
      name: 'feed_attributes',
      type: 'object',
      mandatoryType: 'no',
      multiple: true,
      upsert: false,
      mappings: [
        { name: 'attribute', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
        { name: 'mappings',
          type: 'object',
          mandatoryType: 'no',
          multiple: true,
          upsert: true,
          mappings: [
            { name: 'type', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
            { name: 'attribute', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
          ] },
      ]
    },
    authorizedMembers
  ],
  [ENTITY_TYPE_STREAM_COLLECTION]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'description', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: true },
    { name: 'filters', type: 'json', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'stream_public', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'stream_live', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    authorizedMembers
  ],
  [ENTITY_TYPE_STATUS_TEMPLATE]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'color', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_STATUS]: [
    { name: 'template_id', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'type', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'order', type: 'numeric', precision: 'integer', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_WORK]: [
    { name: 'name', type: 'string', mandatoryType: 'external', multiple: false, upsert: false },
    { name: 'timestamp', type: 'date', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'updated_at', type: 'date', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'event_source_id', type: 'string', mandatoryType: 'external', multiple: false, upsert: false },
    { name: 'event_type', type: 'string', mandatoryType: 'external', multiple: false, upsert: false },
    { name: 'user_id', type: 'string', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'connector_id', type: 'string', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'status', type: 'string', mandatoryType: 'external', multiple: false, upsert: false },
    { name: 'import_expected_number', type: 'numeric', precision: 'integer', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'processed_time', type: 'date', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'received_time', type: 'date', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'completed_time', type: 'date', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'completed_number', type: 'numeric', precision: 'integer', mandatoryType: 'no', multiple: false, upsert: false },
    {
      name: 'messages',
      type: 'object',
      mandatoryType: 'no',
      multiple: true,
      upsert: false,
      mappings: [
        { name: 'timestamp', type: 'date', mandatoryType: 'no', multiple: false, upsert: true },
        { name: 'message', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
      ]
    },
    errors
  ],
  [ENTITY_TYPE_BACKGROUND_TASK]: [
    {
      name: 'actions',
      type: 'object',
      mandatoryType: 'internal',
      multiple: true,
      upsert: false,
      mappings: [
        { name: 'type', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
        { name: 'context',
          type: 'object',
          mandatoryType: 'no',
          multiple: false,
          upsert: true,
          mappings: [
            { name: 'field', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
            { name: 'type', type: 'string', mandatoryType: 'no', multiple: false, upsert: true },
            { name: 'values', type: 'string', mandatoryType: 'no', multiple: true, upsert: true },
          ] },
      ]
    },
    { name: 'type', type: 'string', mandatoryType: 'internal', multiple: false, upsert: false },
    { name: 'scope', type: 'string', mandatoryType: 'external', multiple: false, upsert: false },
    { name: 'rule', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'enable', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'completed', type: 'boolean', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'initiator_id', type: 'string', mandatoryType: 'internal', multiple: false, upsert: false },
    { name: 'task_filters', type: 'json', mandatoryType: 'external', multiple: false, upsert: false },
    { name: 'task_search', type: 'string', mandatoryType: 'external', multiple: false, upsert: false },
    { name: 'task_position', type: 'string', mandatoryType: 'no', multiple: false, upsert: false },
    { name: 'task_excluded_ids', type: 'string', mandatoryType: 'no', multiple: true, upsert: false },
    { name: 'task_processed_number', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'task_expected_number', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'last_execution_date', type: 'date', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    errors,
  ],
  [ENTITY_TYPE_RETENTION_RULE]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'filters', type: 'json', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'max_retention', type: 'numeric', precision: 'integer', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'last_execution_date', type: 'date', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'last_deleted_count', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'remaining_count', type: 'numeric', precision: 'integer', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_SYNC]: [
    { name: 'name', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'uri', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'ssl_verify', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'synchronized', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'user_id', type: 'string', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'token', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'stream_id', type: 'string', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'running', type: 'boolean', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'current_state_date', type: 'date', mandatoryType: 'no', editDefault: false, multiple: false, upsert: false },
    { name: 'listen_deletion', type: 'boolean', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
    { name: 'no_dependencies', type: 'boolean', mandatoryType: 'external', editDefault: true, multiple: false, upsert: false },
  ],
  [ENTITY_TYPE_HISTORY]: HistoryDefinition,
  [ENTITY_TYPE_ACTIVITY]: HistoryDefinition
};

R.forEachObjIndexed((value, key) => schemaAttributesDefinition.registerAttributes(key as string, value), internalObjectsAttributes);
