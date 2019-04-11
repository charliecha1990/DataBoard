import { Class } from 'meteor/jagi:astronomy';
import createRemoteCollection from '/imports/api/createRemoteCollection';
import _ from 'lodash';

export const Products = createRemoteCollection('products');

/* Run the given aggregation, resolving with the results provided by the callback */
// http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#~resultCallback
export const aggregate = (...aggregationArgs) => new Promise((resolve, reject) =>
  Products.rawCollection().aggregate(...aggregationArgs, (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  })
);

Products.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Product = Class.create({
  name: 'Product',
  collection: Products,
  fields: {
    sellers: Object,
    categories: [String],
    brand: String,
    sellers: [Object],
    gender: String,
    images_urls: [String],
    availabilities: Number,
    max_available_time: Number,
    avg_price_changes: Number,
    colors: [Object],
    product_id: Object,
  },
  helpers: {
    priceHigh() {
      return _.max(this.sellers.map(({ price }) => price));
    },

    priceLow() {
      return _.min(this.sellers.map(({ price }) => price));
    }
  }
});

export default Product;
