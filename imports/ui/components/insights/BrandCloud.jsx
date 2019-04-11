import React from 'react';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import _ from 'lodash';

import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';

const styles = theme => ({
  brandItem: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  logo: {
    height: '1em',
    transform: 'translateY(0.1em)',
    marginRight: '0.1em'
  },
});

const displayBrands = (brands) => brands.slice(0, 200);

class BrandCloud extends React.Component {
  state = {
    brands: [],
    tags: [],
  }

  /* Calculate tag styles once per set of brands */
  static getDerivedStateFromProps(nextProps, prevState) {
    const brands = nextProps.brands;
    if (_.isEqual(prevState.brands, brands)) { return null; }

    const display = displayBrands(brands);
    // .map(brand => ({
    //   ...brand,
    //   logo: _.get(_.find(nextProps.logos, { name: brand.name }), 'logo')
    // }));
    const minSize = _.min(_.map(display, 'numProducts'));
    const maxSize = _.max(_.map(display, 'numProducts'));
    const minFontSize = 5;
    const maxFontSize = 30;
    // normalize to 0 and scale to font range
    // (numProducts / scale + minFontSize) ∈ (minFontSize..maxFontSize)
    const scale = parseFloat(maxSize - minSize) / (maxFontSize - minFontSize);

    const tags = display.map(({ name, numProducts }) => ({
      name,
      style: {
        fontSize: parseInt((numProducts - minSize) / scale + minFontSize),
      },
      rotate: parseInt(Math.random() * 10) == 1 ? 90 : 0,
    }));

    return {
      brands,
      tags
    };
  }

  render() {
    const { tags } = this.state;
    if (_.isEmpty(tags)) { return null; }

    const { classes, handleSelect } = this.props;

    return (
      <TagCloud
        style={{
          fontFamily: 'sans-serif',
          fontSize: 30,
          fontWeight: 300,
          flex: '1 1 100%',
          // fontStyle: 'italic',
          color: () => randomColor({ hue: 'blue', luminosity: 'dark' }),
          padding: 5,
          width: '100%',
          height: '100%',
        }}>
        {
          tags.map(({ name, logo, style, rotate }, idx) => (
            <div key={name}
              className={classes.brandItem}
              onClick={() => handleSelect(name)}
              style={style}
              rotate={rotate}>
              { name }
            </div>
          ))
        }
      </TagCloud>
    );
  }
}

export default compose(
  withWidth({ resizeInterval: 40 }),
  withStyles(styles),
)(BrandCloud);
