import React, { FunctionComponent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { SubdirectoryArrowRight } from 'mdi-material-ui';
import { CsvMapperRepresentationAttributeFormData } from '@components/data/csvMapper/representations/attributes/Attribute';
import { useFormatter } from '../../../../../../components/i18n';

interface CsvMapperRepresentionAttributSelectedConfigurationsProps {
  configuration?: CsvMapperRepresentationAttributeFormData
}

const useStyles = makeStyles(() => ({
  attributeOptionsContainer: {
    gridColumnStart: 2,
    gridColumnEnd: 4,
    display: 'flex',
    alignItems: 'center',
  },
  selectedOption: {
    border: '1px solid currentColor',
    padding: '0 8px',
    marginLeft: '4px',
  },
}));

const CsvMapperRepresentionAttributeSelectedConfigurations:
FunctionComponent<CsvMapperRepresentionAttributSelectedConfigurationsProps> = ({ configuration }) => {
  const classes = useStyles();
  const { t } = useFormatter();
  if (!configuration?.pattern_date && !configuration?.separator && !configuration?.default_values) {
    return null;
  }

  return <div className={classes.attributeOptionsContainer}>
    {
      configuration.pattern_date
      && <>
        <SubdirectoryArrowRight/>{t('Date pattern')}:
        <span className={classes.selectedOption}>{configuration.pattern_date}</span>
      </>
    }
    {
      configuration.separator
      && <>
        <SubdirectoryArrowRight/> {t('List separator')}:
        <span className={classes.selectedOption}>{configuration.separator}</span>
      </>
    }
    {
      configuration.default_values
      && <>
        <SubdirectoryArrowRight/> {t('Default value(s)')}:
        <span className={classes.selectedOption}>{configuration.default_values}</span>
      </>
    }
  </div>;
};

export default CsvMapperRepresentionAttributeSelectedConfigurations;
