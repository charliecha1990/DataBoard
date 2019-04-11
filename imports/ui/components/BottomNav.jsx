import React from 'react';
import {withRouter} from "react-router-dom";
import { compose } from 'recompose';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import { BOTTOM_NAV_HEIGHT } from '/imports/ui/helpers/constants';
import { generateRoutes } from '/imports/ui/helpers/routes';

const styles = theme => ({
  divider: {
    width: '100%',
  },
  root: {
    // height: BOTTOM_NAV_HEIGHT,
    position: 'fixed',
    width: '100%',
    bottom: 0,
    // left: 0,
    zIndex: theme.zIndex.drawer,
  },
  paper: {
    width: '100%'
  },
  selectedAction: {
    color: theme.palette.primary.dark
  }
});

const BottomNav = ({classes, onChange, location}) => {
  const routes = generateRoutes();
  return (
    <nav className={classes.root}>
      <Paper className={classes.paper}>
        <BottomNavigation
          value={location.pathname}
          onChange={onChange}
          showLabels={routes.length <= 3}
          >
          { routes.map(({text, link, icon}) => (
            <BottomNavigationAction key={link}
              classes={{ selected: classes.selectedAction }}
              value={link}
              label={text}
              icon={icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </nav>
  );
}

export default compose(
  withRouter,
  withStyles(styles),
)(BottomNav);
