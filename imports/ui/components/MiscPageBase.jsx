import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ErrorBoundary from '/imports/ui/components/ErrorBoundary';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#ddd',
    fontSize: 48,
  },
});

const MiscPageBase = ({ classes, ...props }) => (
  <Grid className={classNames(classes.container, props.className)}
    container
    direction="column"
    justify="center"
    alignItems="center">
    <Grid item>
      <Typography className={classes.title}>Sibyl</Typography>
    </Grid>
    <ErrorBoundary>
      { props.children }
    </ErrorBoundary>
  </Grid>
);

export default withStyles(styles)(MiscPageBase);
