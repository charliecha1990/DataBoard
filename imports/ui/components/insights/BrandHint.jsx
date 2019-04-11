import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Crosshair } from 'react-vis';

const styles = theme => ({
  hintWrapper: {
    opacity: 0.8,
  },
  hint: {
    pointerEvents: 'none',
    position: 'absolute',
    transition: 'top 0.1s ease-in',
  },
  hintMaterial: {
    minWidth: 160,
    position: 'absolute',
    top: 0,
    background: theme.palette.primary.contrastText,
    opacity: 0.8,
    padding: theme.spacing.unit
  },
  hintText: {
    color: '#eee',
  },
});

const BrandHint = ({ value, crosshairValues, classes, ...props }) => (
  <Crosshair
    values={crosshairValues}
    style={{ pointerEvents: 'none' }}
    className={classes.hint}
    {...props}>
    <div className={classes.hintWrapper}>
      <Grow in>
        <Paper elevation={4} className={classes.hintMaterial}>
          <Typography className={classes.hintText} variant="title">{ value.name }</Typography>
          <Typography className={classes.hintText}>Products: { value.numProducts }</Typography>
          <Typography className={classes.hintText}>
            { value.markdowns > 0 ? 'Markups' : 'Markdowns'}:
              { Math.abs(value.markdowns).toFixed(2) }%
          </Typography>
        </Paper>
      </Grow>
    </div>
  </Crosshair>
);

export default withStyles(styles)(BrandHint);
