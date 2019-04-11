import { Meteor } from 'meteor/meteor';
import Experiment from '../Experiment';
import DataSet from '../DataSet';


Meteor.publish('experiments', function () {
  if (!this.userId) {
    return this.ready();
  }
  return Experiment.find({ userId: Meteor.userId() });
});

Meteor.publish('dataSets', function () {
  if (!this.userId) {
    return this.ready();
  }
  return DataSet.find({ userId: Meteor.userId() });
});



// Meteor.publish('lastestExperiments', function () {
//   if (!this.userId) {
//     return this.ready();
//   }
//   return Experiment.find({ userId: Meteor.userId() }).sort({ _id: -1 }).limit(10);
// });
