import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import _ from 'lodash';

import ContainerDimensions from 'react-container-dimensions';


import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import randomColor from 'randomcolor';

import { Treemap } from 'react-vis';

export const TREEMAP_HEIGHT = 300;

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

const treeify = (brands) => ({
  children: brands.map(({ name, numProducts }) => ({
    color: randomColor({ hue: 'blue', luminosity: 'dark', seed: name }),
    opacity: 1,
    size: numProducts,
    // title: name,
  }))
})

class BrandHeatmap extends React.Component {
  state = {
    tree: {},
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

    return {
      tree: treeify(nextProps.brands),
      brandsDigest
    };
  }

  sortNodes = (a, b) => a.value > b.value ? -1 : (a.value < b.value ? 1 : 0)

  render() {
    const { brands, classes, hoverNode, setHoverNode } = this.props;
    if (_.isEmpty(brands)) { return null; }

    return (
      <ContainerDimensions>{ ({ width, height }) =>
        <React.Fragment>
          <Treemap
              margin={0}
              width={width - PADDING * 2}
              height={height - PADDING * 2}
              title="Brands"
              data={this.state.tree}
              colorType="literal"
              renderMode="DOM"
              hideRootNode
              padding={1}
              animation={true}
              onLeafMouseOver={(leafNode, domEvent) => setHoverNode(leafNode)}
              onLeafMouseOut={() => setHoverNode(null)}
              sortFunction={this.sortNodes}
            />
          <Hint node={hoverNode} brands={brands}
                containerWidth={width} containerHeight={height} />
        </React.Fragment>
      }
      </ContainerDimensions>
    );
  }
}

export default compose(
  withStyles(styles),
  withState('hoverNode', 'setHoverNode', null)
)(BrandHeatmap);
