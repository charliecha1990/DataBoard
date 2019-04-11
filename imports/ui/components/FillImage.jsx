import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Image from 'material-ui-image';
import ContainerDimensions from 'react-container-dimensions';

const FILL_PADDING = 2;

/* Render a Material Image that fills the dimensions of its container */
export default ({ imageStyle = {}, ...props }) =>
  <ContainerDimensions>{ ({ width, height }) =>
    <Image imageStyle={{
        maxWidth: width - FILL_PADDING,
        maxHeight: height - FILL_PADDING,
        height: 'auto',
        width: 'auto',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        ...imageStyle
      }}
      disableSpinner
      disableError
      style={{
        width,
        height,
        minHeight: 200,
        padding: 0,
      }}
      {...props} /> }
  </ContainerDimensions>;
