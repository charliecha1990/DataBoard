import { Meteor } from 'meteor/meteor';

import History from '../History';


Meteor.publish('history', function () {
  if (!this.userId) {
    return this.ready();
  }
  return History.find({});
});
