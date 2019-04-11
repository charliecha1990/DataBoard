import Experiment from "./Experiment";
import DataSet from "./DataSet";

Meteor.methods({
  async "experiment.create"(params = {}) {
    const experiment = new Experiment(
      Object.assign({}, params, { userId: Meteor.userId() })
    );

    return new Promise((res, rej) =>
      experiment.save((err, id) => err ? rej(err) : res(id)));
  },
  // async 'experiment.update'({ userId, newExperiment }) {

  //   const experiment = Experiment.findOne(userId);

  //   if (!experiment.editableBy(this.userId)) {
  //     throw new Meteor.Error('unauthorized',
  //       'Cannot update experiment data');
  //   }

  //   Experiment.update(userId, {
  //     $set: { experiment: newExperiment }
  //   });
  // },

  async "dataSet.create"(params = {}) {
    const dataSet = new DataSet(
      Object.assign({}, params, { userId: Meteor.userId() })
    );

    return new Promise((res, rej) =>
      dataSet.save((err, id) => err ? rej(err) : res(id)));
  },

  async "dataSet.update"(params = {}) {
    const dataSet = DataSet.findOne(params.dataSet_id);
    dataSet.set({
      name: params._name,
      description: params._description
    });

    return new Promise((res, rej) =>
      dataSet.save((err, id) => err ? rej(err) : res(id)));
  },

  async "dataSet.delete"(params = {}) {
    const dataSet = DataSet.findOne(params.dataSet_id);
    dataSet.softRemove();
  }
});
