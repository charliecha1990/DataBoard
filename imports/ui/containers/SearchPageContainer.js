import { withMessageContext } from "/imports/ui/helpers/MessageContext";
// import ProfilePage from "/imports/ui/pages/ProfilePage";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import DataSet from "/imports/api/dataSet/DataSet";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { generateFields } from "/imports/util/getDatabaseFields";
import User from "/imports/api/users/User";
import callWithPromise from "../../util/callWithPromise";
import SearchPage from "../pages/SearchPage";


export default compose(
  withRouter,
  withTracker(() => {
    const datasetHandleSearch = Meteor.subscribe("dataSets");
    Meteor.subscribe("users");
    let frontendSkills = generateFields("frontend");
    let backendSkills = generateFields("backend");
    let dataSkills = generateFields("data");

    return {
      loading: !datasetHandleSearch.ready(),
      frontendSkills,
      backendSkills,
      dataSkills
    };

  }),
  withMessageContext)(SearchPage);

