import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import dataSet from "/imports/api/dataSet/DataSet";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { generateFields } from "/imports/util/getDatabaseFields";
import User from "/imports/api/users/User";
import AdminPage from '/imports/ui/pages/AdminPage';

let frontendSkills = generateFields("frontend");
let backendSkills = generateFields("backend");
let dataSkills = generateFields("data");



export default compose(
  withRouter,
  withTracker(() => {
    let found = false;
    const dataSetsHandle = Meteor.subscribe("dataSets");
    Meteor.subscribe("users");
 
    // if(dataSet.length===0){
    //   dataSet = createEmptyObject();
    // }
    // let dataSets = dataSet.find({}).fetch();
    
    let allDataSets = dataSet.find({}).fetch();

    allDataSets.forEach(row => {
      let user = User.findOne({ _id: row.userId });

      row["name"] = user.profile.firstName + " " + user.profile.lastName;
    });

    let dataSets = allDataSets.filter(element => {
      return element.isApproved == false;
    })

    console.log(dataSets)
    // let dataSets = allDataSets.filter()

    return {
      dataSets,
      found,
      connected: Meteor.status().connected,
      loading: !dataSetsHandle.ready(),
      frontendSkills,
      backendSkills,
      dataSkills
    };
  }),
  withMessageContext
)(AdminPage);

