import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import RaisedButton from '/imports/ui/components/buttons/RaisedButton';

const ConfirmDeleteBoard = ({ open, name, onClose, onConfirmDelete }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <DialogContentText>Are you sure you want to delete <strong>{ name }</strong>?</DialogContentText>
      </DialogContent>
    <DialogActions>
      <RaisedButton onClick={onClose}>
        Cancel
      </RaisedButton>
      <RaisedButton onClick={onConfirmDelete} color="secondary">
        Delete
      </RaisedButton>
    </DialogActions>
  </Dialog>
)

export default ConfirmDeleteBoard;
