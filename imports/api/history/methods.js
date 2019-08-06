import History from "./History";
import DataSet from "../../api/dataSet/DataSet";

Meteor.methods({
  async "history.create"(dataSetId) {
    const dataSet = DataSet.findOne(dataSetId);

    console.log(dataSet);
    
    const history = new History(
      Object.assign({}, dataSet, { userId: Meteor.userId() })
    );

    return new Promise((res, rej) =>
      history.save((err, id) => err ? rej(err) : res(id)));
  }
});
