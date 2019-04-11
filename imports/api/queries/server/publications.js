import { Meteor } from 'meteor/meteor';

import Query from '../Query';
import Product from '/imports/api/products/Product';

Meteor.publish('queries.currentUser', function() {
  return Query.find({ userId: this.userId });
});

Meteor.publish('query.results', function(queryId) {
  const query = Query.findOne({ _id: queryId, userId: this.userId });
  if (_.isUndefined(query)) { return; }
  return query.lastResult();
});
