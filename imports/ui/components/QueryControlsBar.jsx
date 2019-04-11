import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Hidden from '@material-ui/core/Hidden';
import { STACKING_BAR_HEIGHT, Z_INDEX_STACKING_BAR } from '../helpers/constants';

import DateRange from './QueryControls/DateRange';
import PriceRange from './QueryControls/PriceRange';
import Tags from './QueryControls/Tags';
import Selector from './QueryControls/BarSelector';
import Gender from './QueryControls/Gender';

import StackingTopBar from './StackingTopBar';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';

const styles = _theme => ({
  backdrop: {
    zIndex: Z_INDEX_STACKING_BAR - 1,
    background: 'rgba(255, 255, 255, 0.6)',
    pointerEvents: 'none',
  },
  floating: {
    position: 'fixed',
    top: STACKING_BAR_HEIGHT * 2,
    transform: 'translateY(-60%)',
    right: '10%',
    zIndex: Z_INDEX_STACKING_BAR + 1,
  },
});

class QueryControlsBar extends React.Component {
  state = {
    open: '',
  }

  handleClick = (title) => () => {
    this.setState({
      open: title,
    });
  }

  onClose = () => {
    this.setState({
      open: '',
    });
  }

  render() {
    const { onChange, brands, categories, query, classes } = this.props;
    const {open} = this.state;
    return [
      <StackingTopBar key="bar">
        <Selector open={open === 'Date'}
          handleClick={this.handleClick('Date')}
          onClose={this.onClose}
          title="Date Range"
          active={query.toDate || query.fromDate}
          >
          <DateRange fromDate={query.fromDate} toDate={query.toDate} onChange={onChange} />
        </Selector>
        <Selector
          open={open === 'Price'}
          handleClick={this.handleClick('Price')}
          onClose={this.onClose}
          title="Price"
          active={query.byPrice}>
          <PriceRange fromPrice={query.fromPrice} toPrice={query.toPrice} byPrice={query.byPrice} onChange={onChange} />
        </Selector>

        {/* Either tag fields or generic [Filters] button */}
        <Hidden xsDown>
          <Selector
            open={open === 'Categories'}
            handleClick={this.handleClick('Categories')}
            onClose={this.onClose}
            title="Categories"
            active={!_.isEmpty(query.categories)}>
            <Tags
              options={categories}
              value={query.categories}
              valueKey={'name'}
              labelKey={'name'}
              onChange={onChange('categories')}
              noun="category" />
          </Selector>
          <Selector
            open={open === 'Brands'}
            handleClick={this.handleClick('Brands')}
            onClose={this.onClose}
            title="Brands"
            active={!_.isEmpty(query.brands)}>
            <Tags
              options={brands}
              value={query.brands}
              valueKey={'name'}
              labelKey={'name'}
              onChange={onChange('brands')}
              noun="brand" />
          </Selector>
          <Selector
            open={open === 'Gender'}
            handleClick={this.handleClick('Gender')}
            onClose={this.onClose}
            title="Gender"
            active={!_.isEmpty(query.gender)}>
            <Gender value={query.gender} onChange={onChange('gender')} />
          </Selector>
        </Hidden>
        <Hidden smUp>
          <Selector
            open={open === 'More'}
            handleClick={this.handleClick('More')}
            onClose={this.onClose}
            title="More Filters"
            active={!_.isEmpty(query.categories) || !_.isEmpty(query.brands) || !_.isEmpty(query.gender)}>
            <Grid item container alignItems="center" justify="space-between">
              <Grid item xs={12} sm={6}>
                <Typography variant="subheading">Tags</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tags
                  options={categories}
                  value={query.categories}
                  valueKey={'name'}
                  labelKey={'name'}
                  onChange={onChange('categories')}
                  noun="category" />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" justify="space-between">
              <Grid item xs={12} sm={6}>
                <Typography variant="subheading">Brands</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Tags
                  options={brands}
                  value={query.brands}
                  valueKey={'name'}
                  labelKey={'name'}
                  onChange={onChange('brands')}
                  noun="brand" />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" justify="space-between">
              <Grid item xs={12} sm={6}>
                <Typography variant="subheading">Gender</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Gender value={query.gender} onChange={onChange('gender')} />
              </Grid>
            </Grid>
          </Selector>
        </Hidden>
      </StackingTopBar>,
      <Backdrop key="backdrop" open={!_.isEmpty(open)} classes={{ root: classes.backdrop }} />,
    ];
  }
}

export default compose(
  withRouter,
  withWidth({resizeInterval: 40}),
  withStyles(styles)
)(QueryControlsBar);
