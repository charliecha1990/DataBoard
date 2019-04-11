import { Meteor } from 'meteor/meteor';
import Board from '../Board';

Meteor.publish('boards', function() {
  return Board.find({ userId: this.userId });
});
