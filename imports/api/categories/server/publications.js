import { Meteor } from 'meteor/meteor';
import Category from '../Category';

Meteor.publish('categories', function() {
  return Category.find();
});
