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
        react: {
          type:Number,
          default:0
        },
        angular:  {
          type:Number,
          default:0
        },
        javascript:  {
          type:Number,
          default:0
        },
        html:  {
          type:Number,
          default:0
        },
        vue:  {
          type:Number,
          default:0
        }
      }
    },

    backend: {
      type: Object,
      optional: true,
      fields: {
        java:  {
          type:Number,
          default:0
        },
        chsharp:  {
          type:Number,
          default:0
        },
        python:  {
          type:Number,
          default:0
        },
        node:  {
          type:Number,
          default:0
        },
        cpp:  {
          type:Number,
          default:0
        }
      }
    },
    data: {
      type: Object,
      optional: true,
      fields: {
        sql:  {
          type:Number,
          default:0
        },
        r:  {
          type:Number,
          default:0
        },
        pandas:  {
          type:Number,
          default:0
        },
        numpy:  {
          type:Number,
          default:0
        },
        spark:  {
          type:Number,
          default:0
        },
        sklearn:  {
          type:Number,
          default:0
        }
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
