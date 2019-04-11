import User from '/imports/api/users/User';
import Query, { findQuery } from '../Query';
import { Products } from '/imports/api/products/Product';

import createInstanceMethods from '/imports/api/createInstanceMethods';

/* Create instance methods for the Query class with Meteor methods named
 * query.reset, etc. */
createInstanceMethods(Query, 'query', {
  async run(query) {
    query.set({ running: true });
    query.save();
  }
});
