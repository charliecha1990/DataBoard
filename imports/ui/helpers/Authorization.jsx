import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';

import { userHasRole } from '/imports/api/users/User';

import Unauthorized from '../components/Unauthorized';
import Loading from '../components/Loading';

/** Ensure that the props of our component are updated once the user loads */
/*    Without this, we can get stuck on loading forever as React doesn't know
 *    to re-render the component */
const withUserTracker = withTracker(() => ({ user: Meteor.user() }));

/* USAGE: Authorization(['admin', 'power-user'])(MyComponent)
          To simply verify a user is logged in:
          Authorization()(MyComponent)
          // OR
          withUserAuth(MyComponent)
*/
const Authorization = (allowedRoles = []) =>
  (WrappedComponent) => {
    class WithAuthorization extends React.Component {
      render() {
        const { unauthorizedMessage, ...props } = this.props;
        const user = Meteor.user();

        /* No user */
        if (_.isEmpty(Meteor.userId())) {
          return <Redirect to="/signin" />
        }

        /* User exists but data hasn't loaded yet (so no roles info) */
        else if (_.isEmpty(user)) {
          return <Loading />
        }

        /* User loaded and authorized */
        else if (_.isEmpty(allowedRoles) || _.some(allowedRoles, role => userHasRole(user, role))) {
          return <WrappedComponent {...props} />
        }

        /* Unauthorized */
        else {
          return _.isUndefined(unauthorizedMessage) ? <Unauthorized /> : unauthorizedMessage;
        }
      }
    }

    return withUserTracker(WithAuthorization);
  }

export const withUserAuth = Authorization();
export default Authorization;
