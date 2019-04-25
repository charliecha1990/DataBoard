import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import BoardPage from '/imports/ui/pages/BoardPage';

export default withTracker(() => {
  const queryHandle = Meteor.subscribe('queries.currentUser');

  return {
    connected: Meteor.status().connected,
    loading: queryHandle.ready(),
  };
})(BoardPage);
