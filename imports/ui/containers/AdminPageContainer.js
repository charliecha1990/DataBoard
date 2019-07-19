import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import AdminPage from '/imports/ui/pages/AdminPage';
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import DataSet from "../../api/dataSet/DataSet";
import {withMessageContext} from "../helpers/MessageContext";


export default compose(
    withRouter,
    withTracker(() => {

      const dataSetsHandle = Meteor.subscribe("dataSets");

      let dataSet = DataSet.find().fetch();
      var requestArray = [];

      dataSet.forEach(element => {
          if(element.isApproved == false){
              requestArray.push(element);
          }
      });


      console.log("AdminContainer",dataSet)

      return {
        dataSet,
        requestArray,
        connected: Meteor.status().connected,
        loading: !dataSetsHandle.ready()
      };
    }),
    withMessageContext
)(AdminPage);
