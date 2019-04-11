import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  positioning: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
}

const Loading = ({ classes, size = 80, ...props }) => (
  <div className={classes.positioning}>
    <CircularProgress
      size={size}
      {...props}
    />
  </div>
)

export default withStyles(styles)(Loading);
