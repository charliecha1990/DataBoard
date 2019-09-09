import React from "react";

import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import AdminIcon from "@material-ui/icons/Build";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import SearchIcon from "@material-ui/icons/Search"
import Badge from "@material-ui/core/Badge";
import ProfilePageContainer from "/imports/ui/containers/ProfilePageContainer";
import Authorization from "/imports/ui/helpers/Authorization";
import BoardPageContainer from "../containers/BoardPageContainer";
import AdminPageContainer from "../containers/AdminPageContainer";
import SearchPageContainer from "../containers/SearchPageContainer";
import AvailabilityContainer from "../containers/AvailabilityContainer";
import CalendarContainer from "../containers/CalendarContainer";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

const Admin = Authorization(["admin"]);

export const ROUTES = {
  user: [
    {
      text: "Board",
      link: "/",
      hasSubRoutes: false,
      component: BoardPageContainer, /* @author:Sujay Updated component to BoardPageContainer*/
      icon: <ViewQuiltIcon/>,
      retainSearchParams: ["query"]
    },
    {
      text: "Profile",
      link: "/profile",
      hasSubRoutes: false,
      component: ProfilePageContainer,
      icon: <PermIdentityIcon/>,
      retainSearchParams: ["query"]
    },
    {
      text: "Search",
      link: "/search",
      hasSubRoutes: true,
      component: SearchPageContainer,
      icon: <SearchIcon/>
    },
    {
      text:"Availability",
      link:"/availability",
      hasSubRoutes:true,
      component: AvailabilityContainer,
      icon:<EventAvailableIcon/>
    },
    {
      text:"Calendar",
      link:"/calendar",
      hasSubRoutes:true,
      component: CalendarContainer,
      icon:<EventAvailableIcon/>
    }
  ],
  admin: [
    {
      text: "Admin",
      link: "/admin",
      hasSubRoutes: true,
      component: Admin(AdminPageContainer),
      icon: <Badge color="secondary" badgeContent={3}> {/* badge number needes to be coded  */}
              <AdminIcon/>
            </Badge>
    }
  ]
};

export const DRAWER_WIDTH = 216;
export const DRAWER_WIDTH_CLOSED = 72;
export const APP_BAR_HEIGHT = 65;
export const STACKING_BAR_HEIGHT = APP_BAR_HEIGHT;
export const BOTTOM_NAV_HEIGHT = 56;

export const Z_INDEX_STACKING_BAR = 100;

export const PAGE_TRANSITION_TIME = { enter: 300, exit: 200 };
