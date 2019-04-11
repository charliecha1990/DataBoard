import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import DateRange from './QueryControls/DateRange';
import PriceRange from './QueryControls/PriceRange';
import Tags from './QueryControls/Tags';
import Gender from './QueryControls/Gender';

import RaisedButton from './buttons/RaisedButton';

import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import Fade from '@material-ui/core/Fade';

import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  container: {
    position: 'relative',
  },
  floating: {
    position: 'fixed',
    bottom: '12%',
    right: '10%',
  },
  itemTitleContainer: {
  },
  itemTitle: {
    width: '100%',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontWeight: 200,
  },
  selectorGroup: {
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    '&:first-child': {
      borderTopWidth: 0,
    },
  },
  selectorGroupContent: {
    padding: theme.spacing.unit * 2,
  },
  querySuccess: {
    color: theme.palette.primary.dark,
  },
  loading: {
    opacity: 0.5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.unit,
    right: theme.spacing.unit,
  },
});

const Selector = withStyles(styles)(({classes, title, onChange, children, ...props}) =>
  <Grid item xs={12} className={classes.selectorGroup} {...props}>
    <Grid container alignItems="center" className={classes.selectorGroupContent}>
      <Grid item xs={12} sm={2}>
        <Typography className={classes.itemTitle} variant="title">{ title }</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Grid container justify="center" alignItems="center">
          { children }
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

class QueryControls extends React.Component {
  onChangeName = ev => {
    ev.preventDefault();
    this.props.onChange('name')(ev.target.value);
  }

  render() {
    const {
      onChange,
      onSubmit,
      onClose,
      classes,
      query,
      querySuccess,
      saving,
      brands: allBrands,
      categories: allCategories,
    } = this.props;

    if (_.isEmpty(query)) { return null; }

    const {
      brands = [],
      categories = [],
      fromDate,
      toDate,
      fromPrice,
      toPrice,
      byPrice,
      gender,
      name = '',
      description,
      running,
    } = query;

    return (
      <div className={classes.container}>
        <IconButton className={classes.closeButton} onClick={this.props.onClose}>
        <CloseIcon />
        </IconButton>

        <form noValidate>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Grid item xs={8} sm={4}>
                  <TextField
                    fullWidth
                    id="name"
                    onChange={this.onChangeName}
                    type="text"
                    label=""
                    value={name}
                    placeholder={description}
                    helperText={_.isEmpty(name) && "(click to set a name)"}
                    margin="dense"
                    InputProps={{
                      disableUnderline: true,
                      // endAdornment:
                      //   <InputAdornment position="end">
                      //
                      //   </InputAdornment>,
                    }}
                    />
                </Grid>
              </Grid>
            </Grid>
            <Selector title="Date Range" xs={12}>
              <DateRange fromDate={fromDate} toDate={toDate} onChange={onChange} />
            </Selector>
            <Selector title="Price" xs={12}>
              <PriceRange
                fromPrice={fromPrice}
                toPrice={toPrice}
                byPrice={byPrice}
                onChange={onChange} />
            </Selector>
            <Selector title="Categories" xs={12}>
              <Tags
                options={allCategories}
                value={categories}
                valueKey={'name'}
                labelKey={'name'}
                onChange={onChange('categories')}
                noun="category" />
            </Selector>
            <Selector title="Brands" xs={12}>
              <Tags
                options={allBrands}
                value={brands}
                valueKey={'name'}
                labelKey={'name'}
                onChange={onChange('brands')}
                noun="brand" />
            </Selector>
            <Selector title="Gender" xs={12}>
              <Gender value={gender} onChange={onChange('gender')} />
            </Selector>
            <Hidden xsDown>
              <Grid item>
                <RaisedButton
                  onClick={onSubmit} color="secondary" size="large"
                  disabled={running}><SearchIcon /></RaisedButton>
              </Grid>
            </Hidden>
            <Grid item xs={12}>
              <Fade in={saving || querySuccess} className={classes.querySuccess}>
                { saving ? <CircularProgress size={40} className={classes.loading} /> :
                  <span><CheckIcon /> Saved.</span> }
              </Fade>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(QueryControls);
