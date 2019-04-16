import React from 'react';

import SearchIcon from '@material-ui/icons/Search';
import TimelineIcon from '@material-ui/icons/Timeline';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import AdminIcon from '@material-ui/icons/Build';
import FlaskIcon from 'mdi-material-ui/FlaskOutline';

import QueryPageContainer from '../containers/QueryPageContainer';
import InsightsPageContainer from '/imports/ui/containers/InsightsPageContainer';
import ProfilePage from '/imports/ui/pages/ProfilePage';
import AdminPage from '/imports/ui/pages/AdminPage';
import Authorization from '/imports/ui/helpers/Authorization';

const Admin = Authorization(['admin']);

export const ROUTES = {
  user: [
    {
      text: "Query",
      link: "/",
      hasSubRoutes: false,
      component: QueryPageContainer,
      icon: <SearchIcon />,
      retainSearchParams: ['query']
    },
    {
      text: "Insights",
      link: "/insights",
      hasSubRoutes: false,
      component: InsightsPageContainer,
      icon: <TimelineIcon />,
      retainSearchParams: ['query']
    },
    {
      text: "Profile",
      link: "/profile",
      hasSubRoutes: true,
      component: ProfilePage,
      icon: <ViewQuiltIcon />,
      retainSearchParams: ['query']
    }
  ],
  admin: [
    {
      text: "Admin",
      link: "/admin",
      hasSubRoutes: true,
      component: Admin(AdminPage),
      icon: <AdminIcon />
    },
  ]
};

export const DRAWER_WIDTH = 216;
export const DRAWER_WIDTH_CLOSED = 72;
export const APP_BAR_HEIGHT = 65;
export const STACKING_BAR_HEIGHT = APP_BAR_HEIGHT;
export const BOTTOM_NAV_HEIGHT = 56;

export const Z_INDEX_STACKING_BAR = 100;
export const Z_INDEX_FLOATING_BUTTON = Z_INDEX_STACKING_BAR + 1;

export const PAGE_TRANSITION_TIME = { enter: 300, exit: 200 };
