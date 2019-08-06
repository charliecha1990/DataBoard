import { Class } from "meteor/jagi:astronomy";
// import createRemoteCollection from '/imports/api/createRemoteCollection';

export const Histories = new Mongo.Collection("histories");

Histories.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const History = Class.create({
  name: "History",
  collection: Histories,
  fields: {
    userId: String,
    name: String,
    frontEndLevel: String,
    backEndLevel: String,
    dataLevel: String,
    isApproved: Boolean,
    // availability: String
  },
  behaviors: {
    timestamp: {
      hasUpdatedField: true,
      updatedFieldName: "updatedAt"
    },
    softremove: {
      removedFieldName: "removed",
      hasRemovedAtField: true,
      removedAtFieldName: "removedAt"
    }
  }
});

export default History;
 