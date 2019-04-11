import { Meteor } from 'meteor/meteor';
import Brand from '../Brand';

Meteor.publish('brands', function() {
  return Brand.find();
});
