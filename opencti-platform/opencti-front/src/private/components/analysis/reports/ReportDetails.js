import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose, head, pathOr } from 'ramda';
import { graphql, createFragmentContainer } from 'react-relay';
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { DescriptionOutlined } from '@mui/icons-material';
import inject18n from '../../../../components/i18n';
import ItemStatus from '../../../../components/ItemStatus';
import ExpandableMarkdown from '../../../../components/ExpandableMarkdown';
import EntityStixCoreRelationshipsHorizontalBars from '../../common/stix_core_relationships/EntityStixCoreRelationshipsHorizontalBars';
import ItemMarking from '../../../../components/ItemMarking';

const styles = (theme) => ({
  paper: {
    height: '100%',
    minHeight: '100%',
    margin: '10px 0 0 0',
    padding: '15px',
    borderRadius: 6,
  },
  chip: {
    fontSize: 12,
    lineHeight: '12px',
    backgroundColor: theme.palette.background.accent,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
    borderRadius: '0',
    margin: '0 5px 5px 0',
  },
  item: {
    height: 50,
    minHeight: 50,
    maxHeight: 50,
    paddingRight: 0,
  },
  itemText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: 10,
  },
  itemIcon: {
    marginRight: 0,
    color: theme.palette.primary.main,
  },
  itemIconDisabled: {
    marginRight: 0,
    color: theme.palette.grey[700],
  },
});

const inlineStyles = {
  itemAuthor: {
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    marginRight: 24,
    marginLeft: 24,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemDate: {
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    marginRight: 24,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

class ReportDetailsComponent extends Component {
  render() {
    const { t, fsd, classes, report } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Typography variant="h4" gutterBottom={true}>
          {t('Entity details')}
        </Typography>
        <Paper classes={{ root: classes.paper }} variant="outlined">
          <Grid container={true} spacing={3} style={{ marginBottom: 20 }}>
            <Grid item={true} xs={6}>
              <Typography variant="h3" gutterBottom={true}>
                {t('Description')}
              </Typography>
              <ExpandableMarkdown source={report.description} limit={400} />
              <Typography
                variant="h3"
                gutterBottom={true}
                style={{ marginTop: 20 }}
              >
                {t('Report types')}
              </Typography>
              {report.report_types?.map((reportType) => (
                <Chip
                  key={reportType}
                  classes={{ root: classes.chip }}
                  label={reportType}
                />
              ))}
              <Typography
                variant="h3"
                gutterBottom={true}
                style={{ marginTop: 20 }}
              >
                {t('Processing status')}
              </Typography>
              <ItemStatus
                status={report.status}
                disabled={!report.workflowEnabled}
              />
            </Grid>
            <Grid item={true} xs={6}>
              <EntityStixCoreRelationshipsHorizontalBars
                title={t('Entities distribution')}
                variant="inEntity"
                stixCoreObjectId={report.id}
                toTypes={['Stix-Core-Object']}
                relationshipType="object"
                field="entity_type"
                seriesName={t('Number of entities')}
              />
            </Grid>
          </Grid>
          <Typography variant="h3" gutterBottom={true}>
            {t('Related reports')}
          </Typography>
          <List>
            {report.relatedContainers.edges
              .filter(
                (relatedContainerEdge) => relatedContainerEdge.node.id !== report.id,
              )
              .map((relatedContainerEdge) => {
                const relatedContainer = relatedContainerEdge.node;
                const markingDefinition = head(
                  pathOr([], ['objectMarking', 'edges'], relatedContainer),
                );
                return (
                  <ListItem
                    key={report.id}
                    dense={true}
                    button={true}
                    classes={{ root: classes.item }}
                    divider={true}
                    component={Link}
                    to={`/dashboard/analysis/reports/${relatedContainer.id}`}
                  >
                    <ListItemIcon>
                      <DescriptionOutlined color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <div className={classes.itemText}>
                          {relatedContainer.name}
                        </div>
                      }
                    />
                    <div style={inlineStyles.itemAuthor}>
                      {pathOr('', ['createdBy', 'name'], relatedContainer)}
                    </div>
                    <div style={inlineStyles.itemDate}>
                      {fsd(relatedContainer.published)}
                    </div>
                    <div style={{ width: 110, paddingRight: 20 }}>
                      {markingDefinition && (
                        <ItemMarking
                          key={markingDefinition.node.id}
                          label={markingDefinition.node.definition}
                          variant="inList"
                        />
                      )}
                    </div>
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      </div>
    );
  }
}

ReportDetailsComponent.propTypes = {
  report: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

const ReportDetails = createFragmentContainer(ReportDetailsComponent, {
  report: graphql`
    fragment ReportDetails_report on Report {
      id
      report_types
      description
      relatedContainers(
        first: 10
        orderBy: published
        orderMode: desc
        types: ["Report"]
        viaTypes: ["Indicator", "Stix-Cyber-Observable"]
      ) {
        edges {
          node {
            id
            ... on Report {
              name
              description
              published
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
                  }
                }
              }
            }
          }
        }
      }
      status {
        id
        order
        template {
          name
          color
        }
      }
      workflowEnabled
    }
  `,
});

export default compose(inject18n, withStyles(styles))(ReportDetails);
