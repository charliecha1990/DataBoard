import { Class } from "meteor/jagi:astronomy";
// import createRemoteCollection from '/imports/api/createRemoteCollection';

export const DataSets = new Mongo.Collection("dataSets");

DataSets.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const DataSet = Class.create({
  name: "data",
  collection: DataSets,
  fields: {
    userId: String,
    practitioner: String,
    frontEnd: String,
    backEnd: String,
    data: String,
    isApproved: Boolean
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

export default DataSet;
