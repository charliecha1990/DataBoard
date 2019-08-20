import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { generateFields } from "/imports/util/getDatabaseFields";
import SearchPage from "../pages/SearchPage";


export default compose(
  withRouter,
  withTracker(() => {
    const dataSetsHandle = Meteor.subscribe("dataSets");
    const availabilityHandle = Meteor.subscribe("availability");
    Meteor.subscribe("users");
    let frontendSkills = generateFields("frontend");
    let backendSkills = generateFields("backend");
    let dataSkills = generateFields("data");
    let skillRange = ["0", "1", "2", "3", "4", "5"];
    let skills = [...frontendSkills,...backendSkills,...dataSkills];
    // console.log(datasetHandleSearch)
    return {
      loading: !dataSetsHandle.ready(),
      loadingAvail:!availabilityHandle.ready(),
      frontendSkills,
      backendSkills,
      dataSkills,
      skills,
      skillRange
    };

  }),
  withMessageContext)(SearchPage);

