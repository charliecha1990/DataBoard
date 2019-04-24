// import Experiment from "./Experiment";
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
    const dataSet = DataSet.findOne(params.user_id);
    dataSet.set({
      practitioner: params._practitioner,
      frontEnd: params._frontEnd,
      backEnd: params._backEnd,
      data: params._data
    });

    return new Promise((res, rej) =>
      dataSet.save((err, id) => err ? rej(err) : res(id)));
  },

  async "dataSet.delete"(params = {}) {
    const dataSet = DataSet.findOne(params.dataSet_id);
    dataSet.softRemove();
  },
  async "dataSets.delete"(params = {}) {
    const dataSet = DataSet.findOne(params.dataSet_id);
    dataSet.softRemove();
  }
});