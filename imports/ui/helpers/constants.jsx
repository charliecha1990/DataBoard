import React from 'react';

import SearchIcon from '@material-ui/icons/Search';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import AdminIcon from '@material-ui/icons/Build';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

import BoardPage from '/imports/ui/pages/BoardPage';
import ProfilePage from '/imports/ui/pages/ProfilePage';
import AdminPage from '/imports/ui/pages/AdminPage';
import Authorization from '/imports/ui/helpers/Authorization';

const Admin = Authorization(['admin']);

export const ROUTES = {
  user: [
    {
      text: "Board",
      link: "/",
      hasSubRoutes: false,
      component: BoardPage,
      icon: <ViewQuiltIcon />,
      retainSearchParams: ['query']
    },
    {
      text: "Profile",
      link: "/profile",
      hasSubRoutes: false,
      component: ProfilePage,
      icon: <PermIdentityIcon />,
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
