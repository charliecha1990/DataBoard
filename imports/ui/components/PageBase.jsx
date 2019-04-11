import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import withSession from '/imports/ui/helpers/withSession';
import { withRouter } from 'react-router-dom';

import { compose } from 'recompose';

import ErrorBoundary from '/imports/ui/components/ErrorBoundary';
import Header from '/imports/ui/components/Header';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import Hidden from '@material-ui/core/Hidden';

import { styles as muiButtonStyles } from '@material-ui/core/Button/Button';

import NavDrawer from '/imports/ui/components/NavDrawer';
import BottomNav from '/imports/ui/components/BottomNav';
import Loading from '/imports/ui/components/Loading';
import PageActionButton from '/imports/ui/components/buttons/PageActionButton';

import { linkWithParams } from '/imports/ui/helpers/routes';

import { DRAWER_WIDTH, PAGE_TRANSITION_TIME } from '/imports/ui/helpers/constants';

const styles = theme => ({
  /* containers that will shift with the opening of the NavDrawer */
  shiftable: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  /* all such elements shrink */
  shiftableShifted: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }
  },
  /* if it is a fixed position element, also move it */
  shiftableShiftedFixed: {
    [theme.breakpoints.up('md')]: {
      marginLeft: DRAWER_WIDTH,
    }
  },
  headers: {
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  wrapper: {
    overflowY: 'scroll',
    overflowX: 'hidden',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  content: {
    position: 'relative',
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    }
  },
  progress: {
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  actionButtonBar: {
    position: 'absolute',
    // transform is overriden when we're wrapped in a Zoom component
    bottom: 0 - muiButtonStyles(theme).fab.height / 2,
    right: 36 * 4, // 4 buttons away
    zIndex: 1,
  },
  actionButtonPage: {
    position: 'fixed',
    bottom: theme.mixins.toolbar.minHeight + theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  }
});

class PageBase extends React.Component {
  componentDidMount() {
    this.setDrawerPosition(false);
  }

  setDrawerPosition = position => {
    this.props.setSession({ navDrawerOpen: position });
  }

  toggleDrawerPosition = () => {
    this.props.setSession({ navDrawerOpen: !this.props.session.navDrawerOpen });
  }

  onBottomNavChange = (event, url) => {
    this.props.history.push(linkWithParams(url, this.props.location.search));
  }

  render() {
    const {
      actionIcon,
      onAction,
      actionButtonProps,
      headers = [],
      classes,
      loading,
      showProgress,
      children,
      session,
      className: classNameProp,
      in: inProp
    } = this.props;

    const { navDrawerOpen } = session;

    const shiftableClass = classNames(classes.shiftable, { [classes.shiftableShifted]: navDrawerOpen });
    const shiftedFixedClass = classNames({ [classes.shiftableShiftedFixed]: navDrawerOpen });
    const headerClassName = classNames(shiftableClass, shiftedFixedClass);

    const topButton =
      <Hidden smDown>
        <PageActionButton
          onClick={onAction}
          icon={actionIcon}
          className={classes.actionButtonBar}
          {...actionButtonProps}
        />
      </Hidden>

    // Hack to show the button at the bottom of all the submenus
    const displayInAppBar = _.isEmpty(headers);
    const displayAfterHeaders = !displayInAppBar

    return (
      <React.Fragment>
        <Header
          className={headerClassName}
          navDrawerOpen={navDrawerOpen}
          toggleDrawerPosition={this.toggleDrawerPosition}
        >
          { displayInAppBar && topButton }
        </Header>
        <NavDrawer
          open={navDrawerOpen}
          setPosition={this.setDrawerPosition}
        />
        <Fade in={inProp} timeout={PAGE_TRANSITION_TIME}>
          <div className={classNames(classes.wrapper, classNameProp, shiftableClass)}>
            <ErrorBoundary>
              <header className={classes.headers}>
                {/* Toolbar for spacing under fixed AppBar */}
                <div className={classes.toolbar} />
                { headers }
                { displayAfterHeaders && topButton }
                { showProgress && <LinearProgress className={classes.progress} /> }
              </header>
              <section className={classes.content}>
                { loading ? <Loading /> : children }
                <Hidden mdUp>
                  <PageActionButton
                    onClick={onAction}
                    icon={actionIcon}
                    className={classes.actionButtonPage}
                    {...actionButtonProps}
                  />
                </Hidden>
              </section>
              <Hidden smUp>
                <BottomNav onChange={this.onBottomNavChange} loading={this.props.loading} />
              </Hidden>
            </ErrorBoundary>
          </div>
        </Fade>
      </React.Fragment>
    );
  }
}

PageBase.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.string,
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSession('pageBaseOptions', { navDrawerOpen: false }),
  withRouter
)(PageBase);
