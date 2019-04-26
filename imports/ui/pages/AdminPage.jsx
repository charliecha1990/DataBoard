import React from 'react';
import { Route } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import User from '/imports/api/users/User';

import PageBase from '../components/PageBase';
import DisplayItem from '../components/DisplayItem';
import AdminTab from '../components/admin/AdminTab';
import Loading from '../components/Loading';


import Grid from '@material-ui/core/Grid';

class AdminPage extends React.Component {
  render() {
    const { users, showRemoved, loading, ...props } = this.props;
    if (loading) {
      return <PageBase {...props}><Loading /></PageBase>;
    }

    return (
      <PageBase {...props}>
        <Grid container justify="center">
          <AdminTab />
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
