import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import PageBase from '../components/PageBase';
import QueryControlsBar from '../components/QueryControlsBar';
import DisplayItem from '../components/DisplayItem';

import '/node_modules/react-vis/dist/style.css';

import AnimatedNumber from 'react-animated-number';

import RefineBar from '../components/insights/RefineBar';
import Brands from '../components/insights/Brands';
// import BrandHeatmap from '../components/insights/BrandHeatmap';
import BrandCloud from '../components/insights/BrandCloud';
import ProductsGrid from '../components/insights/products/ProductsGrid';
import Colors from '../components/insights/Colors';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import RerunIcon from '@material-ui/icons/Autorenew';

import SadFace from '@material-ui/icons/SentimentVeryDissatisfied';
import HappyFace from '@material-ui/icons/SentimentVerySatisfied';
import CompareIcon from '@material-ui/icons/CompareArrows';
import ColorIcon from '@material-ui/icons/ColorLens';
import AssessmentIcon from '@material-ui/icons/Assessment';

import { STACKING_BAR_HEIGHT } from '../helpers/constants';

const styles = theme => ({
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
  },
  smallCard: {
    height: 100
  },
  paperNoPadding: {
    padding: 0,
  },
  loading: {
    height: 240,
    width: 240,
    padding: 24,
  },
  square: {
    height: 240 + theme.spacing.unit * 2,
    minWidth: 240 + theme.spacing.unit * 2,
  },
  itemTitle: {
    alignSelf: 'flex-start',
  },
  itemContainer: {
    height: '100%',
  },
  fillContent: {
    position: 'relative',
    height: 250,
    width: '100%',
    padding: `${theme.spacing.unit * 2}px !important`,
  },
  innerTitleBox: {
    margin: theme.spacing.unit,
    minWidth: '10rem',
    maxHeight: 100
  },
  innerTitleNumber: {
    fontWeight: 100,
    color: 'rgba(0, 0, 0, 0.25)',
  },
  innerTitleLabel: {
    fontWeight: 300,
  },
  animatedTitleNumber: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  columnContainer: {
    height: '100%',
  },
  message: {
    position: 'absolute',
    top: `calc(50vh - ${STACKING_BAR_HEIGHT * 2}px)`,
    left: 0,
    transform: 'translateY(-50%)',
    width: '100%',
  },
  messageWrapper: {
    overflow: 'visible',
  },
  messageContent: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  brandCard: {
    height: 400
  },
  brandTitle: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translateY(-50%)',
    fontWeight: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing.unit
    }
  }
});

const Message = withStyles(styles)(({in: inProp, classes, children}) => (
  <Collapse in={inProp} classes={{ container: classes.message, entered: classes.messageWrapper }}>
    <Grid container alignItems="center" direction="column" className={classes.messageContent}>
      { children }
    </Grid>
  </Collapse>
));

const EmptyMessage = () =>
  <Message in>
    <Typography variant="display3" align="center">
      No results
    </Typography>
    <Typography variant="subheading">
      We couldn&apos;t find any brands that match those specifications.
    </Typography>
  </Message>

const UnRunMessage = () =>
  <Message in>
    <Typography variant="headline" align="center">Run the query to see results!</Typography>
    <HappyFace />
  </Message>

const ErrorMessage = () =>
  <Message in>
    <SadFace />
    <Typography variant="headline">
      Aw geez.
    </Typography>
    <Typography>
      Something about that query didn&apos;t work well.
    </Typography>
    <Typography>
      Try changing the parameters and refreshing?
    </Typography>
    <Typography>
      If this keeps happening, please let us know.
    </Typography>
  </Message>

const AnimatedTitle = withStyles(styles)(({ classes, ...props }) => <AnimatedNumber className={classes.animatedTitleNumber} stepPrecision={0} duration={2000} {...props} />)

class InsightsPage extends React.Component {
  componentDidMount() {
    if (!this.props.querySelected) {
      this.props.pushMessage('Select a query to see insights.');
      this.props.history.push('/');
    }
  }

  // Must mirror API of handleChangeQuery in App
  handleChangeQuery = (field) => (value) => {
    return this.props.handleChangeQuery(field)(value);
  }

  handleRunQuery = () => {
    // this.runQueryDebounced.cancel();
    this.props.runQuery();
  }

  handleRefineBrand = (brand) => {
    this.props.setQueryParam('refineBrand', brand);
  }

  unRefineBrand = () => {
    this.props.setQueryParam('refineBrand', null)
  }

  render() {
    const {
      query,
      location,
      brands: allBrands,
      categories: allCategories,
      result = {},
      mainResult = {},
      classes,
      refineBrand,
      brandLogos,
      loading,
      ...props
    } = this.props;

    if (_.isUndefined(query)) { return <PageBase loading /> }

    /* has query ever been run? */
    const queryHasResults = !_.isEmpty(result);

    let {
      brands = [],
      colorClusters = [],
      productCount = 0,
    } = result;
    const error = !!query.error;

    const showRefineBrand = !_.isEmpty(refineBrand);

    const show = {
      brands: !_.isEmpty(brands) && !showRefineBrand,
      products: productCount > 0,
      colors: !_.isEmpty(colorClusters),
      brand: showRefineBrand,
      // brands: false,
      // products: true,
      // colors: false,
      // brand: false
    };
    const empty = !Object.keys(show).some(k => show[k]);

    const brand = showRefineBrand && _.find(mainResult.brands, { name: refineBrand });
    const logo = brand && brandLogos && _.get(_.find(brandLogos, { name: brand.name }), 'logo');

    const markdowns = brand ? brand.markdowns * -1 : (_.meanBy(brands, 'markdowns') * -1) || 0;
    const markdownColor = `hsla(${markdowns < 0 ? 115 : 0}, ${Math.min(Math.abs(markdowns), 100)}%, 50%, 0.8)`;

    const avgPrice = brand ? brand.avgPrice : _.meanBy(brands, 'avgPrice');

    const queryPending = error || query.running || loading || _.get(result, ['query', 'running']);
    let emptyMessage = null;

    if (!queryPending && empty) {
      emptyMessage = queryHasResults ? <EmptyMessage /> : <UnRunMessage />
    }

    return (
      <PageBase
        {...props}
        headers={
          [
            <QueryControlsBar
              key="qcb"
              onChange={this.handleChangeQuery}
              query={query}
              brands={allBrands}
              categories={allCategories}
            />,
            !!showRefineBrand && <RefineBar key="rb" refineBrand={refineBrand} unRefineBrand={this.unRefineBrand} />
          ]
        }
        actionIcon={<RerunIcon />}
        onAction={this.handleRunQuery}
        actionButtonProps={{
          disabled: query.running
        }}
        loading={loading}
        showProgress={query.running}
      >
        <Grid container spacing={8}>
          { error && <ErrorMessage /> }
          { emptyMessage }

          <DisplayItem show={show.brands || showRefineBrand} sm={8} paperClass={classes.brandCard} title="At a glance" titleIcon={<AssessmentIcon />}>
              {/* showRefineBrand ? <Typography variant="display3" align="center">{ refineBrand }</Typography> */}
            <Grid container justify="center" wrap="nowrap">
              { !showRefineBrand &&
                  <Grid item className={classes.innerTitleBox}>
                    <Typography variant="display2" align="center" className={classes.innerTitleNumber}>
                      <AnimatedTitle value={brands.length} />
                    </Typography>
                    <Typography variant="subheading" align="center" className={classes.innerTitleLabel}>
                      Brands
                    </Typography>
                  </Grid>
              }
              <Grid item className={classes.innerTitleBox}>
                <Typography variant="display2" align="center" className={classes.innerTitleNumber}>
                  <AnimatedTitle value={productCount} />
                </Typography>
                <Typography variant="subheading" align="center" className={classes.innerTitleLabel}>
                  Products
                </Typography>
              </Grid>
            </Grid>
              <div className={classes.fillContent}>
                { showRefineBrand ?
                    <div className={classes.brandTitle}>
                      { logo && <img src={logo} /> }
                      <Typography variant="display4" align="center">{ refineBrand }</Typography>
                    </div> :
                    <BrandCloud brands={brands} logos={brandLogos} handleSelect={this.handleRefineBrand} />
                }
              </div>
          </DisplayItem>

          <DisplayItem show={show.brands || showRefineBrand} sm={4} paperClass={classes.brandCard} title=" ">
              {/* showRefineBrand ? <Typography variant="display3" align="center">{ refineBrand }</Typography> */}
            <Grid container justify="center" style={{ height: '100%' }}>
              { !showRefineBrand &&
                  <Grid item xs={12} sm={12} className={classes.innerTitleBox}>
                    <Typography variant="display2" align="center" className={classes.innerTitleNumber}>
                      <AnimatedTitle value={parseInt(productCount / (brands.length || 1))} />
                    </Typography>
                    <Typography variant="subheading" align="center" className={classes.innerTitleLabel}>
                      Products per brand
                    </Typography>
                  </Grid>
              }
              <Grid item xs={12} sm={12} className={classes.innerTitleBox}>
                <Typography variant="display2" align="center" className={classes.innerTitleNumber} style={{ color: markdownColor }}>
                  <AnimatedTitle value={markdowns}
                                 formatValue={n => `${n.toFixed(2) || 0}%`}
                                 stepPrecision={2}
                                 style={{ color: markdownColor }} />
                </Typography>
                <Typography variant="subheading" align="center" className={classes.innerTitleLabel}>
                  Average { markdowns >= 0 ? 'markdowns' : 'markups' }
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} className={classes.innerTitleBox}>
                <Typography variant="display2" align="center" className={classes.innerTitleNumber} style={{ color: markdownColor }}>
                  <AnimatedTitle value={avgPrice || 0}
                                 formatValue={n => `$${n.toFixed(2) || 0}`}
                                 stepPrecision={2} />
                </Typography>
                <Typography variant="subheading" align="center" className={classes.innerTitleLabel}>
                  Average price
                </Typography>
              </Grid>
            </Grid>
          </DisplayItem>

          <DisplayItem
            show={show.brands}
            xs={12}
            title="How do different brands perform?"
            titleIcon={<CompareIcon />}
          >
            <Brands brands={brands} handleSelect={this.handleRefineBrand} />
          </DisplayItem>

          <DisplayItem
            show={show.colors}
            paperClass={classes.paperNoPadding}
            xs={12}
            title="Which colors feature most prominently for these products?"
            titleIcon={<ColorIcon />}
          >
            <Colors colors={colorClusters} />
          </DisplayItem>

          <DisplayItem show={show.products} xs={12}>
            <ProductsGrid
              result={result}
              />
          </DisplayItem>
        </Grid>
      </PageBase>
    );
  }
}

export default withStyles(styles)(InsightsPage);
