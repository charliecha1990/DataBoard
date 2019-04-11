import React from 'react';

import StackingTopBar from '../StackingTopBar';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FilterIcon from '@material-ui/icons/FilterList';

const RefineBar = ({ refineBrand, unRefineBrand, stackPosition, ...props }) =>
  <StackingTopBar stackPosition={stackPosition}>
    <Chip
      label={refineBrand}
      avatar={<Avatar><FilterIcon /></Avatar>}
      onDelete={unRefineBrand}
    />
  </StackingTopBar>

export default RefineBar;
