import RequestHistory from "./RequestHistory";
import dataSet from "../../api/dataSet/DataSet";

Meteor.methods({
  async "requestHistory.create"(params={}) {
    
    const requestHistory = new RequestHistory(
      Object.assign({}, params, { userId: Meteor.userId() })
    );

    return new Promise((res, rej) =>
      requestHistory.save((err, id) => err ? rej(err) : res(id)));
  }
});
