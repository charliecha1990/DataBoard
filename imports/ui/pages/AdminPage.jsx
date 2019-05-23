import React from 'react';
import { Route } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import User from '/imports/api/users/User';
import callWithPromise from '/imports/util/callWithPromise';

import PageBase from '../components/PageBase';
import AdminTab from '../components/admin/AdminTab';
import Loading from '../components/Loading';
import RejectDialog from '../components/admin/RejectDialog';


import Grid from '@material-ui/core/Grid';

class AdminPage extends React.Component {

  state = {
    rejectDialogOpen: false,
    notice: ''
  }

  handleApprove = () => {
    const para = {
      userId: Meteor.userId(),
      isApproved: true
    }

    callWithPromise('dataSet.approve', para)
    .then(id => console.log(id))
    .then(() => {})
  }

  handleReject= () => {
    const para = {
      userId: Meteor.userId(),
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

/********************************************************************************/  

  render() {
    const { users, showRemoved, loading, ...props } = this.props;

    const { rejectDialogOpen, notice } = this.state;
    if (loading) {
      return <PageBase {...props}><Loading /></PageBase>;
    }

    return (
      <PageBase {...props}>
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
            />
          </Grid>
        </Grid>
      </PageBase>
    );
  }
}

export default withTracker(() => {
  const usersHandle = Meteor.subscribe('users.all', { includeDeleted: true });

  return {
    loading: !usersHandle.ready(),
    users: User.find({}, {
      disableEvents: true
    }).fetch(),
  };
})(AdminPage);
