import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

// import AutosizeInput from 'react-input-autosize';
//
// const autosizingRenderInput = ({addTag, onChange, value, ...other}) => (
//   <AutosizeInput type='text' onChange={onChange} value={value} {...other} />
// );

const styles = theme => ({
  wrapper: {
    flex: 1,
    minWidth: 240,
  },
});

const OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' }
]

const Gender = ({ onChange, value, classes, ...props }) => (
  <Select
    className={classNames(classes.wrapper)}
    options={OPTIONS}
    value={value}
    onChange={v => onChange(v ? v.value : '')}
    menuContainerStyle={{ maxHeight: 300 }}
    menuStyle={{ maxHeight: 298 }}
    {...props}
  />
);

export default withStyles(styles)(Gender);
