import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import BoardsList from './BoardsList';

export default withTracker(() => {
  const boardsHandle = Meteor.subscribe('boards');

  return {
    loading: !boardsHandle.ready(),
  };
})(BoardsList);
