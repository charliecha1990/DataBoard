import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Message = ({ message, handleClose }) =>
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    open={!_.isEmpty(message)}
    onClose={handleClose}
    autoHideDuration={6000}
    ContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">{ message }</span>}
    action={
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
    }
  />;

Message.displayName = 'Message';

export default Message;
