import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import ExperimentsPage from "/imports/ui/pages/ExperimentsPage";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import Experiment from "/imports/api/experiments/Experiment";
import DataSet from "/imports/api/experiments/DataSet";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import _ from "lodash";

export default compose(
  withRouter,
  withTracker(() => {
    const experimentHandle = Meteor.subscribe("experiments");
    const dataSetHandle = Meteor.subscribe("dataSets");
    const pastExperiments = Experiment.find({
      userId: Meteor.userId()
    }).fetch();
    const latestExperiments = _.get(pastExperiments.slice(-1)[0], "results", [
    ]); // only get the lastest experiment
    const dataSets = DataSet.find({ userId: Meteor.userId() }).fetch();

    return {
      latestExperiments,
      pastExperiments,
      dataSets,
      connected: Meteor.status().connected,
      loading: !(experimentHandle.ready() && dataSetHandle.ready())
    };
  }),
  withMessageContext
)(ExperimentsPage);
