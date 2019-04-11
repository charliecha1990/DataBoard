import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import QueryPage from '/imports/ui/pages/QueryPage';
import Query from '/imports/api/queries/Query';

export default withTracker(() => {
  const queryHandle = Meteor.subscribe('queries.currentUser');

  return {
    queries: Query.find({ userId: Meteor.userId() }).fetch(),
    connected: Meteor.status().connected,
    loading: !queryHandle.ready(),
  };
})(QueryPage);
