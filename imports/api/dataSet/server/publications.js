import { Meteor } from 'meteor/meteor';
import dataSet from '../DataSet';


Meteor.publish('dataSet', function () {
  if (!this.userId) {
    return this.ready();
  }
  return dataSet.find({});
});

Meteor.publish('dataSets', function () {
  if (!this.userId) {
    return this.ready();
  }
  return dataSet.find({});
});
