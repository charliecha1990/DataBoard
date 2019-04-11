/* Always make a show of entering and exiting */

import React from 'react';
import Collapse from '@material-ui/core/Collapse';

const DramaticCollapse = props => <Collapse mountOnEnter unmountOnExit appear {...props} />

export default DramaticCollapse;
