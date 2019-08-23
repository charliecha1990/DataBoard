import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
});

const FlatButton = ({classes, children, ...props}) => (
  <Button className={classes.button} {...props}>
    { children }
  </Button>
);

FlatButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FlatButton);
