import { Class } from "meteor/jagi:astronomy";

export const DataSets = new Mongo.Collection("dataSets");

DataSets.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const Dataset = Class.create({
  name: "DataSet",
  collection: DataSets,
  fields: {
    userId: String,

    frontend: {
      type: Object,
      optional: true,
      fields: {
        react: Number,
        angular: Number,
        javascript: Number,
        html: Number,
        vue: Number
      }
    },

    backend: {
      type: Object,
      optional: true,
      fields: {
        java: Number,
        chsharp: Number,
        python: Number,
        node: Number,
        cpp: Number
      }
    },
    data: {
      type: Object,
      optional: true,
      fields: {
        sql: Number,
        r: Number,
        pandas: Number,
        numpy: Number,
        spark: Number,
        sklearn: Number
      }
    },
    isApproved: Boolean
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

export default Dataset;
