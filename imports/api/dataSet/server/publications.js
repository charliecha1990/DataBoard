import { Meteor } from 'meteor/meteor';

import DataSet from '../DataSet';


Meteor.publish('dataSet', function () {
  if (!this.userId) {
    return this.ready();
  }
  return DataSet.find({ userId: Meteor.userId() });
});

Meteor.publish('dataSets', function () {
  if (!this.userId) {
    return this.ready();
  }
  return DataSet.find({ userId: Meteor.userId() });
});
