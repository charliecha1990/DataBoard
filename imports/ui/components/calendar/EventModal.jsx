import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function EventModal(props) {

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create an event</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Event Name"
            type="email"
            fullWidth
            value={props.event.title}
            onChange={(event) => props.onChange("title", event)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Start Date"
            type="email"
            fullWidth
            value={props.event.start}
            onChange={(event) => props.onChange("start", event)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="End Date"
            type="email"
            fullWidth
            value={props.event.start}
            onChange={(event) => props.onChange("end", event)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={props.onSubmit} color="secondary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
