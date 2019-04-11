import { Class } from "meteor/jagi:astronomy";
import Experiment from "./Experiment";
// import createRemoteCollection from '/imports/api/createRemoteCollection';

export const DataSets = new Mongo.Collection("dataSets");

DataSets.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const DataSet = Class.create({
  name: "DataSet",
  collection: DataSets,
  fields: {
    URLs: [String],
    userId: String,
    name: String,
    description: String
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
