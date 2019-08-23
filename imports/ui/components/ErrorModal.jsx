import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import FlatButton from './buttons/FlatButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
  },
  icon: {
    fontSize: 16,
  },
});

export default withStyles(styles)(({ title, text, onClose, classes }) => (
  <Modal open={!!(title && text)} onClose={onClose}>
    <Paper className={classes.modal}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography variant="title" align="center" paragraph>{ title }</Typography>
        <Typography variant="subheading" align="center">{ text }</Typography>
        <FlatButton onClick={onClose} color="secondary">
          Dismiss
          <CloseIcon className={classes.icon} />
        </FlatButton>
      </Grid>
    </Paper>
  </Modal>
));
