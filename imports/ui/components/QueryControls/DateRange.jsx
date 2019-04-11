import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import { DatePicker as MaterialDatePicker } from 'material-ui-pickers';

import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import DateSelectIcon from '@material-ui/icons/Today';

const styles = theme => ({
  datePickerRoot: {
    width: '100%'
  }
})

const DatePicker = withStyles(styles)(({ classes, ...props }) => (
  <Grid item xs={12} sm={6}>
    <MaterialDatePicker
      keyboard
      leftArrowIcon={<ArrowBack />}
      rightArrowIcon={<ArrowForward />}
      keyboardIcon={<DateSelectIcon />}
      format={'YYYY/MM/DD'}
      clearable
      className={classes.datePickerRoot}
      placeholder="YYYY/MM/DD"
      autoOk
      {...props} />
  </Grid>
));

const DateRange = ({fromDate, toDate, onChange}) => [
    <DatePicker
      key={0}
      value={fromDate || null}
      onChange={value => onChange('fromDate')(value && value.toDate())}
      disableFuture
      maxDate={toDate}
      helperText="From"
    />,
    <DatePicker
      key={1}
      value={toDate || null}
      onChange={value => onChange('toDate')(value && value.toDate())}
      disableFuture
      minDate={fromDate}
      helperText="To"
    />
];

export default DateRange;
