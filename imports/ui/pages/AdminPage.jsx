import React from 'react';
import { Route } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import User from '/imports/api/users/User';
import callWithPromise from '/imports/util/callWithPromise';

import PageBase from '../components/PageBase';
import AdminTab from '../components/admin/AdminTab';
import Loading from '../components/Loading';
import RejectDialog from '../components/admin/RejectDialog';
import { Provider } from "../helpers/Context";
import DataSet from "/imports/api/dataSet/DataSet";

import Grid from '@material-ui/core/Grid';

class AdminPage extends React.Component {

  state = {
    rejectDialogOpen: false,
    notice: ''
  }


  handleApprove = () => {
    const para = {
      _isApproved: true
    }  // should get the ids of target dataSets

    callWithPromise('dataSet.approve', para)
    .then(id => console.log(id))
    .then(() => {})
  }

  handleReject= () => {
    const para = {
      userId: Meteor.userId(),
      dataSetId:this.props.dataSet._id, 
      isApproved: false
    }

    this.setState({ rejectDialogOpen: true})

    callWithPromise('dataSet.approve', para)
    .then(id => console.log(id))
    .then(() => {})
  }

/******************************** Event handlers for reject dialog   *******************************/
  
  handleRejectDialogClose = () => {
    this.setState({ rejectDialogOpen: false})
  }

  handleSendRejection = reason => {
    this.setState({ rejectDialogOpen: false, notice: reason})
  }
  
  handleNoticeChange = event => {
    this.setState({ notice: event.target.value})
  }


/********************************************************************************/  

  render() {
    const { users, showRemoved, dataSet, loading, ...props } = this.props;
    const { rejectDialogOpen, notice } = this.state;

    console.log(dataSet)

    if (loading) {
      return <PageBase {...props}><Loading /></PageBase>;
    }

    return (
      <PageBase {...props}>
        <Provider value={this.state.notice}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <AdminTab 
              onApprove={this.handleApprove} 
              onReject={this.handleReject}
            />
            <RejectDialog
              open={rejectDialogOpen} 
              notice={notice}
              onClose={this.handleRejectDialogClose}
              onSend={this.handleSendRejection}
              onNoticeChange={this.handleNoticeChange}
            />
          </Grid>
        </Grid>
        </Provider>
      </PageBase>
    );
  }
}

export default withTracker(() => {
  const usersHandle = Meteor.subscribe('users.all', { includeDeleted: true });
  const dataSetsHandle = Meteor.subscribe("dataSets");

  var UnapprovedDataSets = DataSet.find(
      { userId: Meteor.userId() },
      { sort: { createdAt: -1 }, limit: 1 }
  ).fetch();  // should filter those not have been approved

  return {
    loading: !(usersHandle.ready() && dataSetsHandle.ready()),
    users: User.find({}, {
      disableEvents: true
    }).fetch(),
    UnapprovedDataSets
  };
})(AdminPage);
