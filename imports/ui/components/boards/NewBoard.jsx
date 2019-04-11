import React from 'react';
import callWithPromise from '/imports/util/callWithPromise';
import { withStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

import RaisedButton from '/imports/ui/components/buttons/RaisedButton';

const styles = theme => ({
  dialog: {
    padding: theme.spacing.unit * 2,
  },
  actions: {
    justifyContent: 'center'
  }
});

class NewBoard extends React.Component {
  state = {
    name: ''
  }

  handleCreate = () =>
    callWithPromise('boards.create', this.state)
      .then(id => this.props.onCreated(id))

  handleNameChange = (ev) => {
    ev.preventDefault();

    this.setState({ name: ev.target.value });
  }

  render() {
    const { onClose, classes } = this.props;
    const { name } = this.state;
    return (
      <Dialog open onClose={onClose} className={classes.dialog}>
        <DialogContent>
          <DialogTitle>New Board</DialogTitle>
          <TextField
            fullWidth
            onChange={this.handleNameChange}
            type="text"
            label=""
            value={name}
            placeholder="Name your board..."
            />
          </DialogContent>
        <DialogActions className={classes.actions}>
          <RaisedButton onClick={onClose}>
            Cancel
          </RaisedButton>
          <RaisedButton onClick={this.handleCreate} color="primary" disabled={!name}>
            Create
          </RaisedButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(NewBoard);
