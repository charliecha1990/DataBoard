import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import ProfilePage from "/imports/ui/pages/ProfilePage";
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
    
    let dataSets = dataSet.find({}).fetch();

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

