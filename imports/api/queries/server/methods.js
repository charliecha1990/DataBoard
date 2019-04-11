import User from '/imports/api/users/User';
import Query, { findQuery } from '../Query';
import Result from '/imports/api/results/Result';

import _ from 'lodash';
import moment from 'moment';

import createInstanceMethods from '/imports/api/createInstanceMethods';

createInstanceMethods(Query, 'query', {
  async run(query) {
    const thread = Math.floor(Math.random() * 100000);
    console.log(`(${thread}) Running query`);
    query.set({ running: true, error: false });
    query.save();

    const userId = Meteor.userId();
    const user = User.findOne(userId);

    try {
      const result = await query.initializeResults()

      await result.fetchBrands();
      await result.fetchProductCount();
      await result.fetchProductColors();

    } catch(e) {
      query.set({ error: true });
      console.warn(`Error setting up aggregation: ${e}`);
    }

    query.set({ running: false });
    query.save();
    console.log(`${thread} done`);
  }
});
