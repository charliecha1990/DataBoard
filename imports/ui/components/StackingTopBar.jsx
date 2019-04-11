import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

// import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import DramaticCollapse from '/imports/ui/components/DramaticCollapse';

import { STACKING_BAR_HEIGHT, Z_INDEX_STACKING_BAR } from '../helpers/constants';

const styles = theme => ({
  collapseContainer: {
    zIndex: Z_INDEX_STACKING_BAR,
  },
  collapseWrapperInner: {
    width: '100%',
    // height: STACKING_BAR_HEIGHT,
    flexShrink: 0,
    position: 'relative',
  },
  bar: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'solid',
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 0,
    overflow: 'hidden',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  contentContainer: {
    paddingLeft: 16,
  }
});

// <Divider className={classes.divider} />

const StackingTopBar = ({classes, children, theme, ...props}) => (
  <DramaticCollapse in
    classes={{
      container: classes.collapseContainer,
      wrapperInner: classes.collapseWrapperInner
    }}
  >
    <AppBar position="static" elevation={0} className={classes.bar}>
      <Toolbar>
        <Grid container spacing={theme.spacing.unit * 2} alignItems="center" wrap="nowrap" className={classNames(classes.container, classes.contentContainer)} {...props}>
          { children }
        </Grid>
      </Toolbar>
    </AppBar>
  </DramaticCollapse>
);

export default withStyles(styles, { withTheme: true })(StackingTopBar);
