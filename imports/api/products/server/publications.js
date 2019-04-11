import { Meteor } from 'meteor/meteor';

import Product from '../Product';

Meteor.publish('products', function() {
  return Product.find({
  }, {
    fields: Products.publicFields
  });
});
