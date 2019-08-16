import { withMessageContext } from "/imports/ui/helpers/MessageContext";
// import ProfilePage from "/imports/ui/pages/ProfilePage";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { generateFields } from "/imports/util/getDatabaseFields";
<<<<<<< HEAD
import User from "/imports/api/users/User";
import callWithPromise from "../../util/callWithPromise";
import SearchPage from "../pages/SearchPage";
=======
import Dataset from "../../api/dataSet/DataSet";
>>>>>>> sujay


export default compose(
  withRouter,
  withTracker(() => {
<<<<<<< HEAD
    const datasetHandleSearch = Meteor.subscribe("dataSets");
=======
    const dataSetsHandle = Meteor.subscribe("dataSets");
>>>>>>> sujay
    Meteor.subscribe("users");
    let frontendSkills = generateFields("frontend");
    let backendSkills = generateFields("backend");
    let dataSkills = generateFields("data");
<<<<<<< HEAD

    return {
      loading: !datasetHandleSearch.ready(),
=======
    let skillRange = ["0", "1", "2", "3", "4", "5"];
    // console.log(datasetHandleSearch)
    return {
      loading: !dataSetsHandle.ready(),
>>>>>>> sujay
      frontendSkills,
      backendSkills,
      dataSkills
    };

  }),
  withMessageContext)(SearchPage);

