import { Class } from "meteor/jagi:astronomy";
// import createRemoteCollection from '/imports/api/createRemoteCollection';

export const Experiments = new Mongo.Collection("experiments");

Experiments.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const Experiment = Class.create({
  name: "Experiment",
  collection: Experiments,
  fields: {
    userId: String,
    results: [Object],
    dataSet_id: String
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

export default Experiment;
