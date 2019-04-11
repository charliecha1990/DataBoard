import React from 'react';
import withSession from '/imports/ui/helpers/withSession';
import { withStyles } from '@material-ui/core/styles';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import { compose } from 'recompose';
import _ from 'lodash';

import Hint from './BrandHint';

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend,
} from 'react-vis';

const styles = theme => ({
  legend: {
    position: 'absolute',
    top: 0,
    left: '0%'
  }
});

const PRODUCTS_COLOR = 'rgb(18, 147, 154)';
const MARKDOWN_COLOR = 'rgb(121, 199, 227)';

// Normalize attribute on data to a range between -1 and 1
const normalize = (data, attribute, maxValue = false) => {
  if (_.isEmpty(data)) { return [] };
  const max = maxValue || _.max(_.map(data, d => Math.abs(d[attribute]))) || 1.0;
  return data.map(d => ({
    ...d,
    [attribute]: 1.0 * d[attribute] / max
  }));
}

class BrandBar extends React.Component {
  state = {
    index: null
  }

  handleClickBar = (d, e) => {
    // console.log(d, e);
  }

  handleHover = (d, e) => this.setState({ index: d });

  handleMouseLeave = () => this.setState({ index: null });

  render() {
    const { brands, handleSelect, width, classes, ...props } = this.props;
    const { index } = this.state;
    if (_.isEmpty(brands)) { return null; }

    const smallScreen = !isWidthUp('sm', width)
    const numBrands = smallScreen ? 5 : 20;
    const displayBrands = brands.slice().reverse();
    const axisStyle = {
      // line: { stroke: '#ddd' },
      // text: { stroke: 'none', fill: '#aaa', fontWeight: 200 }
    };
    const largestMarkup = _.max(_.map(displayBrands, 'markdowns'));

    const hintValue = index ? _.find(displayBrands, { name: index.x }) : null;

    return (
      <FlexibleWidthXYPlot height={300}
        margin={{ bottom: 65, right: 50, left: 50 }}
        xType="ordinal"
        onMouseLeave={this.handleMouseLeave}
        animation
        >
        <HorizontalGridLines />
        <VerticalBarSeries
          data={normalize(displayBrands, 'numProducts').map(({ numProducts, name }) => ({ x: name, y: numProducts }))}
          color={PRODUCTS_COLOR}
          onNearestXY={this.handleHover}
          onValueClick={({ x }) => handleSelect(x)}
          />
        <VerticalBarSeries
          data={normalize(displayBrands, 'markdowns', 100).map(({ markdowns, name }) =>({
            x: name,
            y: Math.abs(markdowns),
            color: `hsl(${markdowns >= 0 ? 127 : 0}, ${Math.min(Math.abs(markdowns) * 100, 80).toFixed(2)}%, 50%)`
          }))}
          colorType="literal"
          onValueClick={({ x }) => handleSelect(x)}
          />
        <XAxis tickLabelAngle={-30} style={{ text: { fontSize: 12 } }} />
        <YAxis title="Products"
          style={axisStyle}
          orientation="left"
          yDomain={[0, _.maxBy(displayBrands, 'numProducts')['numProducts']]} />
        <YAxis title="Markdown %"
          right={-10}
          style={axisStyle}
          orientation="right"
          yDomain={[0, 100]} />
        {/* smallScreen ?
            null :
            <DiscreteColorLegend
              items={[
                {
                  title: 'Product Volume',
                  color: PRODUCTS_COLOR
                },
                {
                  title: 'Markdown Rate',
                  color: MARKDOWN_COLOR
                }
              ]}
              className={classes.legend}
              width={200}
              />
          */}
        { hintValue ?
            <Hint crosshairValues={['numProducts', 'markdowns'].map(f => ({ x: hintValue.name, y: hintValue[f] }))}
                  value={hintValue} /> :
            null
        }
      </FlexibleWidthXYPlot>
    );
  }
}

export default compose(
  withWidth({ resizeInterval: 40 }),
  withStyles(styles),
)(BrandBar);
