import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  button: {
    zIndex: 100,
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    opacity: 0.5,
    '&:hover': {
      cursor: 'pointer',
      opacity: 1.0,
    }
  },   
})

const qixi = 'I LOVE YOU';

const CloseButton = ({ onClick, size = 'default', classes, ...props }) => 
  <IconButton className={classes.button} onClick={onClick} aria-label="Close" {...props}>
    <CloseIcon fontSize={size} /> 
  </IconButton>   

export default withStyles(styles)(CloseButton);