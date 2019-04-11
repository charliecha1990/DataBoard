import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';
import Product from '../products/Product';
import Result from '../results/Result';
import moment from 'moment';

export const Queries = new Mongo.Collection('queries');

Queries.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Query = Class.create({
  name: 'Query',
  collection: Queries,
  fields: {
    fromDate: {
      type: Date,
      optional: true,
    },
    toDate: {
      type: Date,
      optional: true,
    },
    fromPrice: {
      type: Number,
      optional: true,
    },
    toPrice: {
      type: Number,
      optional: true,
    },
    byPrice: {
      type: Boolean,
      optional: false,
      default: false,
    },
    tags: {
      type: [String],
      optional: true,
    },
    brands: {
      type: [String],
      optional: true,
    },
    categories: {
      type: [String],
      optional: true,
    },
    gender: {
      type: String,
      optional: true,
    },
    userId: {
      type: String,
      optional: false,
    },
    running: {
      type: Boolean,
      optional: true,
      default: false,
    },
    results: {
      type: [String],
      optional: false,
      default: [],
    },
    error: {
      type: Boolean,
      optional: false,
      default: false,
    },
    name: {
      type: String,
      optional: true,
    },
  },
  behaviors: {
    timestamp: {
      hasUpdatedField: true,
      updatedFieldName: 'updatedAt',
    },
    softremove: {
      removedFieldName: 'removed',
      hasRemovedAtField: true,
      removedAtFieldName: 'removedAt'
    },
  },

  /* Instance methods */
  /* http://jagi.github.io/meteor-astronomy/v2#helpers */
  helpers: {
    authorize() {
      if (this.userId !== Meteor.userId()) { throw 'Unauthorized'; }
    },

    /* default name for a query */
    description() {
      let description = '';

      if (this.fromDate || this.toDate) {
        description += this.fromDate ? 'From ' + moment(this.fromDate).format('YYYY/MM/DD') + ', ' : '';
        description += this.toDate ? 'To ' + moment(this.toDate).format('YYYY/MM/DD') + ', ' : '';
      } else {
        description += 'All dates, '
      }

      if (this.byPrice) {
        description += !this.toPrice ? '> ' : ''
        description += this.fromPrice ? `$${this.fromPrice}` : ''
        description += this.fromPrice && this.toPrice ? ' - ' : ''
        description += !this.fromPrice ? '< ' : ''
        description += this.toPrice ? `$${this.toPrice}` : ''
        description += ', '
      }

      description += `${this.results.length} results`

      return description;
    },
    /** Construct Mongo match criteria from this query **/
    matchRules() {
      let matchRules = {};
      if (this.fromDate)
        matchRules.created_at = { $gte: moment(this.fromDate).unix() };

      if (this.toDate)
        matchRules.updated_at = { $lte: moment(this.toDate).unix() };

      if (this.byPrice) {
        let priceRules = {}
        if (this.toPrice) {
          Object.assign(priceRules, { $lte: this.toPrice });
        }
        if (this.fromPrice) {
          Object.assign(priceRules, { $gte: this.fromPrice })
        }
        matchRules['sellers'] = {
          $elemMatch: { price: priceRules }
        }
      }

      if (!_.isEmpty(this.categories)) {
        matchRules.categories = {
          $elemMatch: { $in: this.categories }
        }
      }

      if (!_.isEmpty(this.brands)) {
        matchRules.brand = { $in: this.brands }
      }

      if (!_.isEmpty(this.gender)) {
        matchRules.gender = this.gender
      }

      return matchRules;
    },

    lastResult() {
      return Result.find({ queryId: this._id }, { sort: { createdAt: -1 }, limit: 1 });
    }
  },
});

export const findQuery = (id) => {
  let query = Query.findOne(id);
  if (_.isEmpty(query)) { throw(404); }
  return query;
}

export default Query;
