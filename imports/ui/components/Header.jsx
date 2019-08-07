import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { linkWithParams } from '/imports/ui/helpers/routes';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import classNames from 'classnames';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

/* Material UI Tooltips with Drawer is broken */
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

import PowerIcon from '@material-ui/icons/PowerSettingsNew';
// import AdminIcon from '@material-ui/icons/Build';
import PersonIcon from '@material-ui/icons/Person';

// import Authorization from '/imports/ui/helpers/Authorization';
// const AdminOnly = Authorization(['admin']);

export const appBarZIndex = theme => theme.zIndex.drawer + 1;

const styles = theme => ({
  appBar: {
    background: 'white',
    zIndex: appBarZIndex(theme),
    borderBottomWidth: 1,
    borderBottom: theme.palette.divider,
    borderBottomStyle: 'solid',
  },
  appBarShift: {
  },
  container: {
    height: '100%'
  },
  menuButton: {
    marginLeft: 12,
  },
  hide: {
    display: 'none',
  },
  button: {
    minWidth: 36,
    maxWidth: 36,
  },
  logo: {
    height: theme.mixins.toolbar.minHeight - 8,
    // width: APP_BAR_HEIGHT,
    padding: 4,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  itemGroup: {
    marginRight: theme.spacing * 2
  },
});

const ItemGroup = ({ children, ...props }) => (
  <Grid item {...props}>
    <Grid container alignItems="center">
     { children }
    </Grid>
  </Grid>
);

const NavButton = withStyles(styles, { withTheme: true })(
  ({ title, classes, onClick, children, ...buttonProps }) => (
    <Tooltip
        title={title}
        position="bottom"
        distance={8}
        duration={200}
        animation="scale"
        style={{height: '100%', display: 'block'}}
    >
      <Button className={classes.button} size="small" onClick={onClick} {...buttonProps}>
        { children }
      </Button>
    </Tooltip>
  )
);

// const AdminButton = AdminOnly(NavButton);

class Header extends React.Component {
  handleLogoClick = () => {
    this.props.history.push(linkWithParams('/'));
  }

  handleUserClick = () => {
    this.props.history.push(linkWithParams('/'));
  }

  render() {
    const { navDrawerOpen, toggleDrawerPosition, classes, className, children } = this.props;
    return (
      <React.Fragment>
        <AppBar
          position="fixed"
          elevation={0}
          className={classNames(classes.appBar, className)}
        >
          <Toolbar disableGutters={true}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={toggleDrawerPosition}
              className={classNames(classes.menuButton, navDrawerOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Grid container justify="space-between" alignItems="center" className={classes.container}>
              <img src="/logo.png"
                   className={classes.logo}
                   onClick={this.handleLogoClick} />

              <Grid item />
              <ItemGroup className={classes.itemGroup}>
                <NavButton title={_.get(Meteor.user(), ['emails', 0, 'address'])} onClick={this.handleUserClick}>
                  <PersonIcon />
                </NavButton>
                <NavButton title={'Sign Out'} onClick={Meteor.logout}>
                  <PowerIcon />
                </NavButton>
              </ItemGroup>
            </Grid>
            { children }
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  onLogout: PropTypes.func,
  history: PropTypes.object
};

export default compose(
  withRouter,
  withStyles(styles, { withTheme: true }),
)(Header);
