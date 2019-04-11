import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import _ from 'lodash';

import ContainerDimensions from 'react-container-dimensions';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FloatingActionButton from '/imports/ui/components/buttons/FloatingActionButton';
import ShuffleIcon from '@material-ui/icons/Shuffle';

import Color from 'color';

import { Treemap } from 'react-vis';

export const TREEMAP_HEIGHT = 300;

const styles = theme => ({
  container: {
    position: 'relative',
    height: TREEMAP_HEIGHT,
    width: '100%',
    padding: '0 !important',
    overflow: 'hidden',
  },
  button: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    opacity: 0.7,
    transition: 'opacity 0.1s ease-in',
    '&:hover': {
      opacity: 1.0,
    },
  },
  treemapContainer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    height: TREEMAP_HEIGHT,
    width: '100%',
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

const Hint = withStyles(styles)(({ node, colors, containerWidth, containerHeight, classes }) => {
  if (!node) { return null; }

  let mainColorNode = node;

  // find second-level (main) color
  while (mainColorNode.depth > 1) {
    mainColorNode = mainColorNode.parent;
  }

  const mainColor = _.find(colors, color =>
    color.size === mainColorNode.value && Color.rgb(color.color).hex() === mainColorNode.data.color);
  const subColor = mainColorNode != node && _.find(mainColor.children, color =>
    color.size === node.value && Color.rgb(color.color).hex() === node.data.color);

  if (!mainColor) { return null; }

  let tipX = node.x || (node.x1 + node.x0) / 2;
  let tipY = node.y || (node.y1 + node.y0) / 2;

  if (tipX + HINT_WIDTH >= containerWidth) {
    tipX = containerWidth - HINT_WIDTH;
  }

  if (tipY + HINT_HEIGHT >= containerHeight) {
    tipY = containerHeight - HINT_HEIGHT;
  }

  return (
    <Paper elevation={4}
           className={classes.hintMaterial}
           style={{
             left: tipX,
             top: tipY
           }}>
      <Typography className={classes.hintText} variant="title" align="center">
        <span className={classes.colorChip} style={{ background: Color.rgb(mainColor.color).string() }} />
        { mainColor.name }
      </Typography>
      <Typography className={classes.hintText} align="center">{ mainColor.size } products</Typography>
      { subColor &&
          <Typography className={classes.hintText} align="center">
            { '\u21B3' }
            <span className={classes.colorChip} style={{ background: Color.rgb(subColor.color).string() }} />
            { subColor.name }: { subColor.size } products
          </Typography>
      }
    </Paper>
  );
});

const treeify = (colorClusters) => ({
  children: colorClusters.map(({ color, children, name }) => ({
    color: Color.rgb(color).hex(),
    opacity: 1,
    children: children.map(subColor => ({
      color: Color.rgb(subColor.color).hex(),
      size: subColor.size
    }))
  }))
})

const MODES = [
  'partition', 'binary', 'circlePack',
]

class Colors extends React.Component {
  state = {
    tree: {},
    colorsDigest: []
  }

  /* Only re-map colors to tree structure when necessary */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (_.isEmpty(nextProps.colors)) {
      return {
        tree: {},
        colorsDigest: []
      }
    }

    const colorsDigest = _.flatMap(nextProps.colors, 'color');
    if (_.isEqual(prevState.colorsDigest, colorsDigest)) {
      return null;
    }

    return {
      tree: treeify(nextProps.colors),
      colorsDigest
    };
  }

  sortNodes = (a, b) => a.value > b.value ? -1 : (a.value < b.value ? 1 : 0)

  render() {
    const { colors, classes, mode, setMode, hoverNode, setHoverNode } = this.props;
    if (_.isEmpty(colors)) { return null; }

    return (
      <div className={classes.container}>
        <ContainerDimensions>{ ({ width, height }) =>
          <React.Fragment>
            <div
              className={classes.treemapContainer}
              style={{
                // HACK: scale and move treemap to hide blank space occupied by root node in partition mode
                transform: MODES[mode] === 'partition' ? 'scaleY(1.5) translateY(-16.5%)' : 'none',
              }}>
                  <Treemap
                      margin={0}
                      width={width}
                      height={TREEMAP_HEIGHT}
                      title="Colors"
                      data={this.state.tree}
                      colorType="literal"
                      renderMode="DOM"
                      hideRootNode
                      padding={1}
                      animation={false}
                      mode={MODES[mode]}
                      onLeafMouseOver={(leafNode, domEvent) => setHoverNode(leafNode)}
                      onLeafMouseOut={() => setHoverNode(null)}
                      sortFunction={this.sortNodes}
                    />
            </div>
            <Hint node={hoverNode} colors={colors}
                  containerWidth={width} containerHeight={height} />

            <FloatingActionButton className={classes.button} color="secondary"
                                  onClick={() => setMode((mode + 1) % MODES.length)}>
              <ShuffleIcon />
            </FloatingActionButton>
          </React.Fragment>
        }
        </ContainerDimensions>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withState('mode', 'setMode', 0),
  withState('hoverNode', 'setHoverNode', null)
)(Colors);
