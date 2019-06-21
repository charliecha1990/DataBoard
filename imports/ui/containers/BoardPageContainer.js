import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import BoardPage from '/imports/ui/pages/BoardPage';
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import DataSet from "../../api/dataSet/DataSet";
import {withMessageContext} from "../helpers/MessageContext";
import ProfilePage from "../pages/ProfilePage";

// export default withTracker(() => {
//   const queryHandle = Meteor.subscribe('queries.currentUser');
//
//   return {
//     connected: Meteor.status().connected,
//     loading: queryHandle.ready(),
//   };
// })(BoardPage);
/*
@author:Sujay
subscribe to dataSets for change in data
register the board page
 */
export default compose(
    withRouter,
    withTracker(() => {

      const dataSetsHandle = Meteor.subscribe("dataSets");

      let dataSet = DataSet.find().fetch();

      return {
        dataSet,
        connected: Meteor.status().connected,
        loading: !dataSetsHandle.ready()
      };
    }),
    withMessageContext
)(BoardPage);
