import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import QueryPage from '/imports/ui/pages/QueryPage';

export default withTracker(() => {
  const queryHandle = Meteor.subscribe('queries.currentUser');

  return {
    connected: Meteor.status().connected,
    loading: !queryHandle.ready(),
  };
})(QueryPage);
