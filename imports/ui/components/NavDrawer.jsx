import React from 'react';
import classNames from 'classnames';
import withSession from '/imports/ui/helpers/withSession';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { compose } from 'recompose';

import NavList from './NavList';

import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { DRAWER_WIDTH, DRAWER_WIDTH_CLOSED } from '../helpers/constants';

const styles = theme => ({
  drawerPaper: {
    width: DRAWER_WIDTH,
    overflowY: 'auto',
    height: '100%',
    // paddingTop: theme.appBar.maxHeight,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    width: DRAWER_WIDTH_CLOSED,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbarPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

class NavDrawer extends React.Component {
  state = {
    toolTipVisibility: 'off'
  }


  handleChangeRequestNavDrawer = () => {
    this.props.setSession({
      open: !this.props.session.open,
    });
  }

  navItemHover = (value) => {
    this.setState({ toolTipVisibility: value });
  }

  componentDidUpdate() {
    const lastWidth = this.props.session.width;
    const nextWidth = this.props.width;
     /*  We open/close the left drawer based on resizes. We use the session
           to make sure we only close the drawer when the user crosses a
           breakpoint, so that if a user is already on a small screen and
           opens the menu, we don't close it as soon as they resize, and
           vice versa.
     */

   let nextSession = { width: nextWidth };
    /* (1) resize events: open/close drawer */
    if (nextWidth !== lastWidth) {
      /*
       * 1. Only open if we're passing small -> large
       * 2. Only close if we're passing large -> small
       */
      const wasLarge = isWidthUp('md', lastWidth);
      const wasSmall = !wasLarge;
      const isLarge = isWidthUp('md', nextWidth);
      const isSmall = !isLarge;
      const smallToLarge = wasSmall && isLarge;
      const largeToSmall = wasLarge && isSmall;
      if (smallToLarge || largeToSmall) {
        this.props.setPosition(isLarge);
      }
    }

    this.props.setSession(nextSession);
  }

  render() {
    const { classes, theme, open, setPosition } = this.props;
    const drawerClasses = classNames(classes.drawerPaper, !open && classes.drawerPaperClose);
    const contents = (
      <React.Fragment>
        <div className={classes.toolbarPlaceholder}>
          <IconButton onClick={setPosition.bind(this, false)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <NavList
          onMenuPress={setPosition.bind(this, !open)}
          open={open}
          toolTipVisibility={!open && this.state.toolTipVisibility}
          itemHover={this.navItemHover} />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Hidden mdUp>
          <Drawer
            open={open}
            onClose={setPosition.bind(this, false)}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            ModalProps={{
              keepMounted: true,
            }}
          >
            { contents }
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            classes={{
              docked: drawerClasses,
              paper: drawerClasses,
            }}
            open={open}
          >
            { contents }
          </Drawer>
        </Hidden>
      </React.Fragment>
    );
  }
}

export default compose(
  withSession('NavDrawerScreenWidth', { width: 0 }),
  withWidth({ resizeInterval: 40 }),
  withStyles(styles, { withTheme: true })
)(NavDrawer);
