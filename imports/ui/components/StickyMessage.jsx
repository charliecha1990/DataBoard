import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default ({ message }) =>
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={!_.isEmpty(message)}
    ContentProps={{
      'aria-describedby': 'sticky-message-id',
    }}
    message={<span id="message-id">{ message }</span>}
  />;
