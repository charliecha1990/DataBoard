import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import SearchPage from "/imports/ui/pages/SearchPage";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { generateFields } from "/imports/util/getDatabaseFields";
import Dataset from "../../api/dataSet/DataSet";


export default compose(
  withRouter,
  withTracker(() => {
    const dataSetsHandle = Meteor.subscribe("dataSets");
    let frontendSkills = generateFields("frontend");
    let backendSkills = generateFields("backend");
    let dataSkills = generateFields("data");
    let fieldstring = "frontend.react";
    let res = Dataset.find({ "frontend.react": 4 }).fetch()
    console.log(res);
    return {
      loading: !dataSetsHandle.ready(),
      frontendSkills,
      backendSkills,
      dataSkills
    };
  }),
  withMessageContext
)(SearchPage);
