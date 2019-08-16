import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import BoardPage from "/imports/ui/pages/BoardPage";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import Dataset from "../../api/dataSet/DataSet";
import { withMessageContext } from "../helpers/MessageContext";
import {generateFields} from "/imports/util/getDatabaseFields";
import User from "/imports/api/users/User";

/*
@author:Sujay
subscribe to dataSets for change in data
register the board page
 */
// let generateFields = (name) => {
//   let fields = Dataset.getFields();
//   let mapping = fields.filter(element => element["name"] === name)
//     .map(element => element["fields"]);
//   return Object.keys(mapping[0]);
// };


export default compose(
  withRouter,
  withTracker(() => {

    Meteor.subscribe("dataSets");
    Meteor.subscribe("users");
    let dataset = Dataset.find().fetch();

    dataset.forEach(row => {
      let user = User.findOne({_id:row.userId});

      row["name"] = user.profile.firstName+" "+user.profile.lastName
    });
    /*
    * Get fields from database and pass them to header
    * */
    let frontendSkills = generateFields("frontend");
    let backendSkills = generateFields("backend");
    let dataSkills = generateFields("data");

    return {
      dataset,
      frontendSkills,
      backendSkills,
      dataSkills
    };
  }),
  withMessageContext
)(BoardPage);
