import { Class } from 'meteor/jagi:astronomy';
import Query, { findQuery } from '/imports/api/queries/Query';
import Product from '/imports/api/products/Product';
import _ from 'lodash';

import savePromise from '/imports/api/savePromise';

export const Results = new Mongo.Collection('results');

Results.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Result = Class.create({
  name: 'Result',
  collection: Results,
  fields: {
    // query at time of running
    query: Object,
    // original query document (may have changed since run)
    queryId: {
      type: String,
      optional: true
    },
    userId: {
      type: String,
      optional: true,
    },
    parentId: {
      type: String,
      optional: true,
    },
    brands: {
      type: [Object],
      optional: true
    },
    colorClusters: {
      type: Object,
      optional: true
    },
    productCount: {
      type: Number,
      optional: true
    },
    subResults: {
      type: Object,
      optional: false,
      default: []
    },
  },

  behaviors: {
    timestamp: {
      hasCreatedField: true,
      createdFieldName: 'createdAt',
    },
  },

  helpers: {
    authorize() {
      if (this.userId) {
        if (this.userId !== Meteor.userId()) {
          throw 'Unauthorized';
        }
      } else {
        findQuery(this.queryId).authorize();
      }
    },

    /* cursor of paginated products matching same criteria as query.run */
    products(page, size, sort = { 'sellers.price': -1 }) {
      return Product.find(this.queryObject().matchRules(), { limit: size, skip: page * size, sort });
    },

    queryObject() {
      return new Query(this.query);
    },

    findSubResult(conditions) {
      return Result.findOne({ parentId: this._id, ...conditions });
    },

    refineBrand(brand) {
      return this.findSubResult({ 'query.brands': brand });
    },

    /* Create a new result set refining just by the selected brand */
    /* We also don't run the 'brands' aggregation, for obvious reasons */
    createBrandResults(brand) {
      if (!_.isEmpty(existing = this.refineBrand(brand))) {
        console.log(`exists: ${existing._id}`)
        return existing._id;
      }

      const thread = Math.floor(Math.random() * 100000);
      console.log(`(${thread}) Running brand query`);

      const newResult = new Result({
        query: {
          ...this.query,
          brands: [brand],
          running: true,
        },
        userId: Meteor.userId(),
        parentId: this._id
      });
      newResult.save();
      newResult.reload();

      this.set({
        subResults: this.subResults.concat(newResult._id)
      });
      this.save();

      /* Asyncronously queue up result aggregation */
      newResult.fetchProductCount()
               .then(() => newResult.fetchProductColors())
               .then(() => {
                 newResult.set({ query: { ...newResult.query, running: false }})
                 return savePromise(newResult, { fields: ['query'] });
               })
               .then(() => console.log(`${thread} done`))
               .catch(() => console.warn('FAILED brand fetch chain'))

      return newResult._id;
    }
  },

  // createColorResult(hex) {
  //   /* Depends on fetchProductColors to be idempotent */
  //   if (!_.isEmpty(existing = this.refineColor(hex))) {
  //     console.log(`exists: ${existing._id}`)
  //     return existing._id;
  //   }
  //
  //   const thread = Math.floor(Math.random() * 100000);
  //   console.log(`(${thread}) Running color query`);
  //
  //   const newResult = new Result({
  //     query: {
  //       ...this.query,
  //       colors: [hex],
  //       running: true,
  //     },
  //     userId: Meteor.userId(),
  //     parentId: this._id
  //   });
  //   newResult.save();
  //   newResult.reload();
  //
  //   this.set({
  //     brandResults: {
  //       ...this.brandResults,
  //       [brand]: newResult._id
  //     }
  //   });
  //   this.save();
  //
  //   /* Asyncronously queue up result aggregation */
  //   newResult.fetchProductCount()
  //            .then(() => newResult.fetchProductColors())
  //            .then(() => {
  //              newResult.set({ query: { ...newResult.query, running: false }})
  //              return savePromise(newResult, { fields: ['query'] });
  //            })
  //            .then(() => console.log(`${thread} done`))
  //            .catch(() => console.warn('FAILED brand fetch chain'))
  //
  //   return newResult._id;
  // },
});

export default Result;
