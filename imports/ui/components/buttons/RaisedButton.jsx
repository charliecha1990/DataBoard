import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none',
  },
});

const RaisedButtons = ({classes, children, ...props}) => (
  <Button variant="contained" color="secondary" className={classes.button} {...props}>
    { children }
  </Button>
);

RaisedButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RaisedButtons);
