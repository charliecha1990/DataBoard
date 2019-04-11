import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Grid } from '@material-ui/core';

import ImageFeatureResults from './ImageFeatureResults';
import ImageSegmentationResults from './ImageSegmentationResults';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(14),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
});

const ResultPanel = props => {
  const { classes, colors, tags, query, index, imageResult, labels, imageSegmentation, imageFeatures } = props;
  const URL = _.isEmpty(query) ? null : query.substring(0, 30);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>URL:{index + 1}</Typography>
        <Typography className={classes.secondaryHeading}>{URL}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            {imageFeatures && <ImageFeatureResults
              query={query}
              tags={tags}
              colors={colors}
            />}
          </Grid>
          <Grid item xs={12} md={6}>
            {imageSegmentation &&
              <ImageSegmentationResults
                imageResult={imageResult}
                labels={labels}
              />
            }
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ResultPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultPanel);