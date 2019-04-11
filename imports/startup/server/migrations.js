import Query, { Queries } from '/imports/api/queries/Query';

/* Rename currentQuery to currentQueryId */
Migrations.add({
  version: 1,
  name: 'Rename currentQuery to currentQueryId',
  up() {
    Queries.rawCollection().aggregate([
        { "$addFields": {  currentQueryId: '$currentQuery' } },
        { "$out": "queries" }
      ], { allowDiskUse: true }).toArray();
  },
  down() {
    Queries.rawCollection().aggregate([
        { "$addFields": {  currentQueryId: '$currentQuery' } },
        { "$out": "queries" }
      ], { allowDiskUse: true }).toArray();
  }
});
