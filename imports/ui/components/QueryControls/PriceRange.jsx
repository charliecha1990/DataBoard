import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const changePrice = (onChange) =>
  ([from, to]) => (
    onChange()({
      fromPrice: from,
      toPrice: to,
      byPrice: true,
    })
  );

const PriceRange = ({fromPrice = 0, toPrice = 10000, byPrice = false, onChange}) => ([
  <Grid item key={'toggle'}>
    <FormControlLabel
      control={<Switch checked={byPrice} onChange={(ev) => onChange('byPrice')(ev.target.checked)} />}
      label="Filter by price" />
  </Grid>,
  <Grid item xs={12} key={'title'}>
    <Typography variant="title" align="center">${fromPrice} to ${toPrice}</Typography>
  </Grid>,
  <Range key={'range'}
    tipFormatter={number => `\$${number}`}
    min={0}
    max={10000}
    onChange={changePrice(onChange)}
    value={[fromPrice, toPrice]}
    />
]);

export default PriceRange;
