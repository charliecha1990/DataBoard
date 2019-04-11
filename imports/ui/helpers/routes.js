import { compose } from 'recompose';
import { ROUTES } from './constants';
import queryString from 'query-string';
import _ from 'lodash';

import { userHasRole } from '/imports/api/users/User';

export const generateRoutes = (filterRole = false) => {
  const user = Meteor.user();
  if (_.isEmpty(user)) { return [] };
  let routeGroups = filterRole ? [filterRole] : _.keys(ROUTES);
  return routeGroups.filter(role => userHasRole(user, role)).flatMap(role => ROUTES[role]);
}

export const linkWithParams = (location, paramString) => {
  const retain = _.get(_.find(generateRoutes(), { link: location }), 'retainSearchParams');
  return {
    pathname: location,
    search: queryString.stringify(_.pick(queryString.parse(paramString), retain))
  };
};
