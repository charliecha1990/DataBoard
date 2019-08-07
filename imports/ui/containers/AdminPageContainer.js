import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import AdminPage from '/imports/ui/pages/AdminPage';
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import DataSet from "../../api/dataSet/DataSet";
import RequestHistory from "../../api/requestHistory/RequestHistory";
import {withMessageContext} from "../helpers/MessageContext";


export default compose(
    withRouter,
    withTracker(() => {
      const dataSetsHandle = Meteor.subscribe("dataSets");
      const requestHistoryHandle = Meteor.subscribe("histories")

      const dataSet = DataSet.find().fetch();
      const requestHistory = RequestHistory.find().fetch();
      const requestArray = [];

      dataSet.forEach(element => {
          if(element.isApproved == false){
              requestArray.push(element);
          }
      });

      const getRequestNumber = () => {
        var requestArray = [];
        let dataSet = DataSet.find().fetch();
      
      
        dataSet.forEach(element => {
          if(element.isApproved == false){
              requestArray.push(element);
          }
        });
      
        return requestArray.length;
      
      };
      

      return {
        requestArray,
        requestHistory,
        connected: Meteor.status().connected,
        loading: (!dataSetsHandle.ready() && requestHistoryHandle.ready())
      };
    }),
    withMessageContext
)(AdminPage);
