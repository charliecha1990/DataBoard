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
  // tag: {
  //   backgroundColor: theme.palette.secondary.main,
  //   color: theme.palette.secondary.contrastText,
  //   borderColor: theme.palette.secondary.dark,
  //   borderRadius: 2,
  //   borderWidth: 1,
  //   borderStyle: 'solid',
  //   display: 'inline-block',
  //   fontSize: '13px',
  //   fontWeight: 400,
  //   marginBottom: 5,
  //   marginRight: 5,
  //   maxWidth: '100%',
  //   padding: 5,
  //   '& a:before': {
  //     content: '" ×"',
  //     color: theme.palette.secondary.contrastText,
  //   }
  // },
  // focused: {
  //   borderColor: theme.palette.secondary.light,
  // },
  // remove: {
  //
  // },
});
/* Map results of react-select array to strings like we want */
const handleSelectChange = (onChange, key) =>
  selectedArray => onChange(selectedArray.map(b => b[key]));

const Tags = ({options, values, valueKey, onChange, classes, noun = 'tag', ...props}) => (
  <Select
    multi
    className={classNames(classes.wrapper)}
    options={_.sortBy(options, valueKey)}
    value={values}
    valueKey={valueKey}
    onChange={handleSelectChange(onChange, valueKey)}
    menuContainerStyle={{ maxHeight: 300 }}
    menuStyle={{ maxHeight: 298 }}
    {...props}
  />
);

export default withStyles(styles)(Tags);
