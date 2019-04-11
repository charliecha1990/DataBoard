import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import User from '/imports/api/users/User';

/** Ensure that the props of our component are updated once the user loads */
/*    Without this, we can get stuck on loading forever as React doesn't know
 *    to re-render the component */
const withUserTracker = withTracker(() => {
  if (Meteor.isServer) {
    let userId, user;
    WebApp.connectHandlers.use((req, _res, _next) => {
      userId = req.Cookies.get('userId');
      user = User.findOne({ _id: userId });
    });
    return { user, userId };
  } else {
    return {
      user: Meteor.user(),
      userId: Meteor.userId(),
    };
  }
});

export default withUserTracker;
