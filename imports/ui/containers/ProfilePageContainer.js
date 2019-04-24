import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import ProflePage from "/imports/ui/pages/ProflePage";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import  DataSet from "/imports/api/dataSet/DataSet"
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import _ from "lodash";

export default compose(
  withRouter,
  withTracker(() => {
    const dataSetHandle = Meteor.subscribe("dataSet");
    const dataSetsHandle = Meteor.subscribe("dataSets");
    const dataSet = DataSet.find({ userId: Meteor.userId() }).fetch();
    const dataSets = DataSet.find().fetch();

    return {
      dataSets,
      dataSet,
      connected: Meteor.status().connected,
      loading: !(dataSetHandle.ready() && dataSetsHandle.ready())
    };
  }),
  withMessageContext
)(ProflePage);
