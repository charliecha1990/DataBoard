import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import BoardsList from './BoardsList';
import Board from '/imports/api/boards/Board';

export default withTracker(() => {
  const boardsHandle = Meteor.subscribe('boards');

  return {
    boards: Board.find({ userId: Meteor.userId() }).fetch(),
    loading: !boardsHandle.ready(),
  };
})(BoardsList);
