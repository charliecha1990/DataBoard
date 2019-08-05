import History from "./History";

Meteor.methods({
  async "history.create"(params = {}) {
    const history = new History(
      Object.assign({}, params, { userId: Meteor.userId() })
    );

    return new Promise((res, rej) =>
      dataSet.save((err, id) => err ? rej(err) : res(id)));
  }
});
