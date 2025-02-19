import React, { FunctionComponent } from 'react';
import { graphql, useFragment } from 'react-relay';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ContainerStixObjectsOrStixRelationships from '@components/common/containers/ContainerStixObjectsOrStixRelationships';
import ExpandableMarkdown from '../../../../components/ExpandableMarkdown';
import { useFormatter } from '../../../../components/i18n';
import { CaseTaskOverview_task$data, CaseTaskOverview_task$key } from './__generated__/CaseTaskOverview_task.graphql';
import ItemDueDate from '../../../../components/ItemDueDate';
import ItemMarkings from '../../../../components/ItemMarkings';
import ItemStatus from '../../../../components/ItemStatus';
import ItemAssignees from '../../../../components/ItemAssignees';

const CaseTaskOverviewFragment = graphql`
  fragment CaseTaskOverview_task on Task {
    id
    name
    created
    due_date
    description
    workflowEnabled
    creators {
      id
      name
    }
    createdBy {
      ... on Identity {
        id
        name
        entity_type
      }
    }
    objectMarking {
      edges {
        node {
          definition
          definition_type
          id
        }
      }
    }
    objectLabel {
      edges {
        node {
          id
          value
          color
        }
      }
    }
    objectAssignee {
      edges {
        node {
          entity_type
          id
          name
        }
      }
    }
    status {
      template {
        name
        color
      }
    }
    ...ContainerStixObjectsOrStixRelationships_container
  }
`;

interface CaseTaskOverviewProps {
  tasksData: CaseTaskOverview_task$key;
}

const CaseTaskOverview: FunctionComponent<CaseTaskOverviewProps> = ({
  tasksData,
}) => {
  const { t, fldt } = useFormatter();
  const data: CaseTaskOverview_task$data = useFragment(
    CaseTaskOverviewFragment,
    tasksData,
  );
  return (
    <>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={6}>
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Description')}
          </Typography>
          <ExpandableMarkdown source={data.description} limit={300} />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Assignees')}
          </Typography>
          <ItemAssignees assigneesEdges={data.objectAssignee?.edges ?? []} />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Creation date')}
          </Typography>
          {fldt(data.created)}
        </Grid>
        <Grid item={true} xs={6}>
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Due Date')}
          </Typography>
          <ItemDueDate due_date={data.due_date} variant="inElement" />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Processing status')}
          </Typography>
          <ItemStatus status={data.status} disabled={!data.workflowEnabled} />
          {data.objectMarking && (
            <>
              <Typography
                variant="h3"
                gutterBottom={true}
                style={{ marginTop: 20 }}
              >
                {t('Marking')}
              </Typography>
              <ItemMarkings
                markingDefinitionsEdges={data.objectMarking.edges ?? []}
              />
            </>
          )}
        </Grid>
        <div style={{ width: '100%', margin: '20px 10px 0 25px' }}>
          <ContainerStixObjectsOrStixRelationships
            isSupportParticipation={false}
            container={data}
            variant="noPaper"
          />
        </div>
      </Grid>
    </>
  );
};
export default CaseTaskOverview;
