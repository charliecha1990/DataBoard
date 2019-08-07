import DataSet from "./DataSet";

Meteor.methods({
  async "dataSet.create"(params = {}) {
    const dataSet = new DataSet(
      Object.assign({}, params, { userId: Meteor.userId() })
    );

    return new Promise((res, rej) =>
      dataSet.save((err, id) => err ? rej(err) : res(id)));
  },

  async "dataSet.update"(params = {}) {
    const dataSet = DataSet.findOne({userId:params.userId});
    DataSet.findOne({userId:params.userId});
    dataSet.set({
      frontend: params.frontend,
      backend: params.backend,
      data: params.data,
      isApproved: params.isApproved
    });

    return new Promise((res, rej) =>
      dataSet.save((err, id) => err ? rej(err) : res(id)));
  },

  async "dataSet.delete"(params = {}) {
    const dataSet = DataSet.findOne(params.dataSet_id);
    dataSet.softRemove();
  },
  async "dataSet.search"(dataSetId) {
    return DataSet.findOne(dataSetId);
  },
  async "dataSet.approve"(params= {}) {
    const dataSet = DataSet.findOne( params.dataSet_id );

    if(params.approve == true) {

      dataSet.set({
        isApproved: true
      });
      return new Promise((res, rej) =>
        dataSet.save((err, id) => err ? rej(err) : res(id)));
    } else {

      dataSet.set({
        isApproved: false
      });
      return new Promise((res, rej) =>
        dataSet.save((err, id) => err ? rej(err) : res(id)));

    }

   
  },
});
