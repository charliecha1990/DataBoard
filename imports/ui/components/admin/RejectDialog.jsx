import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Consumer } from "../../helpers/Context";


const styles = theme => ({
  root: {
    width: 900
  }
});

class RejectDialog extends React.Component {


  render() {
    const { open, notice, onClose, onSend, onNoticeChange } = this.props;

    return (
      <div className='root'>
          <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
          >
            {/* <DialogTitle id="form-dialog-title">Leave a message</DialogTitle> */}
            <DialogContent>
              <DialogContentText>
                Leave a message to the practitioner(s)
              </DialogContentText>
              <Consumer>
                {context => 
                  <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  value={context}
                  onChange={onNoticeChange}
                  fullwidth={true}
                />
                }
              </Consumer>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={onSend} color="secondary">
                Send
              </Button>
            </DialogActions>
          </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(RejectDialog);