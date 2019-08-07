import { Meteor } from 'meteor/meteor';

import RequestHistory from '../RequestHistory';


Meteor.publish('requestHistory', function () {
  if (!this.userId) {
    return this.ready();
  }
  return RequestHistory.find();
});
