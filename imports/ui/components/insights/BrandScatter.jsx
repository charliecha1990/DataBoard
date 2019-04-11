import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { COLORS } from '/imports/ui/helpers/colors';
import _ from 'lodash';

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  Hint,
  MarkSeries
} from 'react-vis';

import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  label: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  chart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '100%',
    width: '100%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintWrapper: {
    opacity: 0.8,
  },
  hintMaterial: {
    minWidth: 160,
    position: 'absolute',
    top: 0,
    background: theme.palette.primary.contrastText,
    opacity: 0.8,
    padding: theme.spacing.unit
  },
  hintText: {
    color: '#eee',
  },
});

const chartify = (brands, outMin, outMax) => {
  const min = _.min(_.map(brands, 'numProducts'));
  const max = _.max(_.map(brands, 'numProducts'));

  return brands.map(brand => ({
    x: brand.priceLow,
    y: brand.markdowns,
    size: (brand.numProducts - min) / (max - min) * (outMax - outMin) + outMin
  }))
};

class BrandHeatmap extends React.Component {
  state = {
    hovered: null
  }

  handleHover = (value) => {
    this.setState({ hovered: value })
  }

  handleUnHover = () => this.handleHover(null)

  render() {
    const { brands, classes } = this.props;
    const { hovered } = this.state;
    const brandHover = hovered ? _.find(brands, { markdowns: hovered.y }) : false;

    return (
      <div className={classes.container}>
        <div className={classes.chart}>
          <FlexibleXYPlot>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <MarkSeries
              onNearestXY={this.handleHover}
              onValueMouseOut={this.handleUnHover}
              onSeriesMouseOut={this.handleUnHover}
              strokeWidth={2}
              opacity="0.8"
              sizeRange={[5, 15]}
              data={chartify(brands, 5, 15)}/>
            { brandHover &&
                <Hint value={hovered}
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    transition: 'top 0.1s ease-in',
                    zIndex: 1000,
                  }}>
                  <div className={classes.hintWrapper}>
                    <Grow in>
                      <Paper elevation={4} className={classes.hintMaterial}>
                        <Typography className={classes.hintText} variant="title">{ brandHover.name }</Typography>
                        <Typography className={classes.hintText}>Products: { brandHover.numProducts }</Typography>
                        <Typography className={classes.hintText}>
                          { brandHover.markdowns > 0 ? 'Markups' : 'Markdowns'}:
                            { Math.abs(brandHover.markdowns).toFixed(2) }%
                        </Typography>
                      </Paper>
                    </Grow>
                  </div>
                </Hint>
            }
          </FlexibleXYPlot>
        </div>
        <Typography className={classes.label} variant="display1">{ brands.length } brands</Typography>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BrandHeatmap);
