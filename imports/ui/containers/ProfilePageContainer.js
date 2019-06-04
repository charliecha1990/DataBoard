import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import ProfilePage from "/imports/ui/pages/ProfilePage";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import DataSet from "/imports/api/dataSet/DataSet";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import _ from "lodash";


export default compose(
    withRouter,
    withTracker(() => {
        const dataSetsHandle = Meteor.subscribe("dataSets");

        var dataSet = DataSet.find(
            { userId: Meteor.userId() },
            { sort: { createdAt: -1 }, limit: 1 }
        ).fetch();
        dataSet = dataSet.length == 0 ? "" : dataSet[0];
        var dataSets = DataSet.find({}).fetch();

        return {
            dataSet,
            dataSets,
            connected: Meteor.status().connected,
            loading: !dataSetsHandle.ready()
        };
    }),
    withMessageContext
)(ProfilePage);
