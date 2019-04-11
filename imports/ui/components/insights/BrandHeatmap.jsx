import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import _ from 'lodash';

import ContainerDimensions from 'react-container-dimensions';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import randomColor from 'randomcolor';

import { FlexibleXYPlot, XAxis, YAxis, HeatmapSeries } from 'react-vis';

const styles = theme => ({
  container: {
    position: 'relative',
    height: '80%',
    width: '100%',
    padding: '0 !important'
  },
  hintMaterial: {
    width: HINT_WIDTH,
    position: 'absolute',
    top: 0,
    background: theme.palette.primary.contrastText,
    padding: theme.spacing.unit,
    pointerEvents: 'none',
    transition: 'top 0.4s ease-in-out, left 0.2s ease-in-out'
  },
  hintText: {
    color: '#eee',
  },
  colorChip: {
    height: theme.spacing.unit * 2,
    width: theme.spacing.unit * 2,
    display: 'inline-block',
    transform: 'translateY(20%)',
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  }
});

const HINT_WIDTH = 160;
const HINT_HEIGHT = 100;

const PADDING = 8;

const Hint = withStyles(styles)(({ node, brands, containerWidth, containerHeight, classes }) => {
  if (!node) { return null; }
  let tipX = node.x || (node.x1 + node.x0) / 2;
  let tipY = node.y || (node.y1 + node.y0) / 2;

  if (tipX + HINT_WIDTH >= containerWidth) {
    tipX = containerWidth - HINT_WIDTH;
  }

  if (tipY + HINT_HEIGHT >= containerHeight) {
    tipY = containerHeight - HINT_HEIGHT;
  }

  const brand = _.find(brands, { name: node.data.title });
  if (!brand) { return null; }

  return (
    <Paper elevation={4}
           className={classes.hintMaterial}
           style={{
             left: tipX,
             top: tipY
           }}>
      <Typography className={classes.hintText} variant="title" align="center">
        { brand.name }
      </Typography>
      <Typography className={classes.hintText} align="center">{ brand.numProducts } products</Typography>
    </Paper>
  );
});

const bucket = (numbers, count) => {
  const min = _.min(numbers);
  const max = _.max(numbers);
  const bucketSize = (max - min) / Math.min(count, numbers.length);

  return [_.range(min, max + bucketSize, bucketSize), bucketSize];
}

const mapToScale = (array, start, end) => {
  const divisor = _.max(array) / end;
  const offset = _.min(array);

  return array.map(a => (a - offset) / divisor + start);
}

const logMap = (array, attr) => mapToScale(array, Math.max(_.min(array), 1), _.max(array)).map(Math.log);

const treeify = (brands) => {
  const xSeries = logMap(_.map(brands, 'avgPrice'));
  const ySeries = logMap(_.map(brands, 'numProducts'));

  const [xBuckets, xSize] = bucket(xSeries, 10);
  const [yBuckets, ySize] = bucket(ySeries, 10);

  /* Count brands in each bucket */
  const bucketed = xBuckets.flatMap(x => yBuckets.map(y => ({
    x: (x + (x + xSize)) / 2, y: (y + (y + ySize)) / 2,
    brands: brands.filter((b, idx) =>
      xSeries[idx] >= x && xSeries[idx] < x + xSize &&
      ySeries[idx] >= y && ySeries[idx] < y + ySize
    ).length
  })));

  const fullest = _.max(_.map(bucketed, 'brands'));

  /* Map to color */
  return [bucketed.map(({ x, y, brands }) => ({
    x, y,
    color: `hsla(200, 80%, 40%, ${brands === 0 ? 0 : Math.max(brands / fullest, 0.1)})`
  })), xBuckets, yBuckets];
}

const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

class BrandHeatmap extends React.Component {
  state = {
    tree: {},
    xBuckets: [],
    yBuckets: [],
    brandsDigest: []
  }

  /* Only re-map brands to tree structure when necessary */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (_.isEmpty(nextProps.brands)) {
      return {
        tree: {},
        brandsDigest: []
      }
    }

    const brandsDigest = _.flatMap(nextProps.brands, 'name');
    if (_.isEqual(prevState.brandsDigest, brandsDigest)) {
      return null;
    }

    const [tree, xBuckets, yBuckets] = treeify(nextProps.brands);

    return {
      tree,
      xBuckets,
      yBuckets,
      brandsDigest
    };
  }

  sortNodes = (a, b) => a.value > b.value ? -1 : (a.value < b.value ? 1 : 0)

  render() {
    const { brands, classes, hoverNode, setHoverNode } = this.props;
    if (_.isEmpty(brands)) { return null; }

    return (
      <FlexibleXYPlot margin={{ bottom: 30, top: 0, left: 40, right: 0 }}>
        <XAxis title="Brand average price"
               tickFormat={n => Math.floor(Math.exp(n))}
               tickValues={this.state.xBuckets}
               tickLabelAngle={_.last(this.state.xBuckets) >= Math.log(10000) ? -30 : 0}
               style={{
                 text: { opacity: 0.5 },
               }}
          />
        <YAxis title="Matching products"
               tickFormat={n => Math.floor(Math.exp(n))}
               tickValues={this.state.yBuckets}
               style={{
                 text: { opacity: 0.5 },
               }}
               />
        <HeatmapSeries
          className="heatmap-series-example"
          data={this.state.tree}
          colorType="literal"
          />
      </FlexibleXYPlot>

    );
  }
}

export default compose(
  withStyles(styles),
  withState('hoverNode', 'setHoverNode', null)
)(BrandHeatmap);
