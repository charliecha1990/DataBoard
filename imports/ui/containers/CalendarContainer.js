import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import DataSet from "../../api/dataSet/DataSet";
import { withMessageContext } from "../helpers/MessageContext";
import { generateFields } from "/imports/util/getDatabaseFields";
import User from "/imports/api/users/User";
import CalendarPage from "/imports/ui/pages/CalendarPage";


export default compose(
  withRouter,
  withTracker(() => {
    Meteor.subscribe("dataSets");
    Meteor.subscribe("users");
    let dataSets = DataSet.find().fetch();
    console.log(dataSets);
    dataSets.forEach(row => {
      let user = User.findOne({ _id: row.userId });
      row["name"] = user.profile.firstName + " " + user.profile.lastName;
    });
    /*
     * Get fields from database and pass them to header
     * */
    let frontendSkills = generateFields("frontend");
    let backendSkills = generateFields("backend");
    let dataSkills = generateFields("data");

    return {
      dataSets,
      frontendSkills,
      backendSkills,
      dataSkills
    };
  }),
  withMessageContext
)(CalendarPage);
