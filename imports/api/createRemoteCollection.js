/* Use a remote mongo server for a collection.
 * Must specify the PRODUCTS_MONGO_URL environment variable. */
const createRemoteCollection = (collection) =>
  (Meteor.isServer && !_.isEmpty(process.env.PRODUCTS_MONGO_URL)) ?
    new Mongo.Collection(collection, {
      _driver: new MongoInternals.RemoteCollectionDriver(process.env.PRODUCTS_MONGO_URL)
    }) : new Mongo.Collection(collection);

export default createRemoteCollection;
