import User from '/imports/api/users/User';
import Query, { findQuery } from './Query';
import Result from '/imports/api/results/Result';
import { Products } from '../products/Product';
import savePromise from '/imports/api/savePromise';

import createInstanceMethods from '/imports/api/createInstanceMethods';

/* Create instance methods for the Query class with Meteor methods named
 * query.reset, etc. */
createInstanceMethods(Query, 'query', {
  async reset(query) {
    query.set({ running: false });
    query.save();
  },

  /* resolve with the ID of the query if new */
  upsert: (query, changes) => new Promise((res, rej) => {
    query.set(changes);
    query.validate();
    if (Meteor.isClient) { return res(); }
    query.save((err, id) => err ? rej(err) : res(query._id || id));
  }),

  softDelete: async (query) => query.softRemove(),

  initializeResults(query) {
    const result = new Result({
      query: query.raw(),
      queryId: query._id
    });

    return savePromise(result)
      .then(() => result)
      .catch(err => console.warn(err))
  },
});

Meteor.methods({
  async 'queries.new'(params = {}) {
    const query = new Query(Object.assign({}, params, { userId: Meteor.userId() }));

    return new Promise((res, rej) =>
      query.save((err, id) => err ? rej(err) : res(id))
    );
  }
})
