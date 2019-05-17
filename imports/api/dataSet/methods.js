// import DataSet from "./DataSet";
// import DataSets from "./DataSet";

// Meteor.methods({
//     async "subscribe.now"(params = {}) {
//         try {
//             DataSets.insert(
//                 Object.assign({}, params, { userId: Meteor.userId() })
//             );
//             console.log("inserted data", DataSets.find({}).fetch());
//         } catch (err) {
//             throw new Meteor.Error("something happened");
//         }
//     },
//     async "dataSet.create"(params = {}) {
//         const dataSet = new DataSet(
//             Object.assign({}, params, { userId: Meteor.userId() })
//         );
//         // changes name but doesnt persist, i.e. collection remains null
//         dataSet.name = "hilin";
//         console.log("my id: " + Meteor.userId(), dataSet);
//         // DataSets.insert(dataSet);
//         console.log(DataSets.find().fetch());
//         return new Promise((res, rej) => {
//             dataSet.save((err, id) => err ? rej(err) : res(id));
//         });
//     },

//     async "dataSet.update"(params = {}) {
//         const dataSet = DataSet.findOne(params.user_id);
//         dataSet.set({
//             practitioner: params._practitioner,
//             frontEnd: params._frontEnd,
//             backEnd: params._backEnd,
//             data: params._data,
//             isApproved: params._isApproved
//         });

//         return new Promise((res, rej) =>
//             dataSet.save((err, id) => err ? rej(err) : res(id)));
//     },

//     async "dataSets.delete"(params = {}) {
//         const dataSet = DataSet.findOne(params.dataSet_id);
//         dataSet.softRemove();
//     }
// });
