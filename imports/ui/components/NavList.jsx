import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import _ from 'lodash';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';

/* Material UI Tooltips with Drawer is broken */
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';

import { DRAWER_WIDTH_CLOSED, APP_BAR_HEIGHT } from '/imports/ui/helpers/constants';
import { generateRoutes, linkWithParams } from '/imports/ui/helpers/routes';

const styles = theme => ({
  menuListItem: {
    height: APP_BAR_HEIGHT - 1,
  },
  listRoot: {
    height: '100%',
    padding:"0 10px 0 10px"
  },
  listItem: {
    color: theme.palette.primary.contrastText,
    opacity: 0.8,
    height: '100%',
    marginLeft:"10%",
    marginTop:"3%"
  },
  listItemActive: {
    color: theme.palette.primary.dark,
    opacity: 1,
  },
});

const NavListItem = withStyles(styles)(
  ({ route, location, onHover, showTooltip, classes }) => {
    const { text, link, icon } = route;
    // debounce on the level of a ListItem hover, for both on and off
    const hoverEvent = _.debounce(onHover);
    const colorClass = classNames(classes.listItem,
      link === location.pathname && classes.listItemActive
    );

    return (
      <ListItem
        button
        component={Link}
        to={linkWithParams(link, location.search)}
        className={colorClass}
        onMouseOver={() => hoverEvent(link)}
        onMouseOut={() => hoverEvent('none')}>
        <ListItemIcon className={colorClass} padding="10%" color="red">
          { icon }
        </ListItemIcon>
        <ListItemText
          primary={text}
          classes={{
            primary: colorClass
          }}
        />
        <ListItemSecondaryAction style={{height: '100%'}}>
          <Tooltip
            title={text}
            open={showTooltip}
            position="right"
            distance={DRAWER_WIDTH_CLOSED * -1}
            duration={200}
            animation="scale"
            style={{height: '100%', display: 'block'}}
          ><div style={{height: '100%'}} /></Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    );
});

const NavList = ({ location, classes, toolTipVisibility, itemHover }) => (
  <List component="nav" className={classes.listRoot} disablePadding>
    {
      generateRoutes('user').map(route =>
        <NavListItem key={route.link}
                     location={location} route={route}
                     onHover={itemHover} showTooltip={toolTipVisibility === route.link} />
      )
    }

    <Divider />

    {
      generateRoutes('admin').map(route =>
        <NavListItem key={route.link}
                     location={location} route={route}
                     onHover={itemHover} showTooltip={toolTipVisibility === route.link} />
      )
    }
  </List>
);

export default withRouter(withStyles(styles)(NavList));
