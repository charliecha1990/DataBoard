import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import RequestForm from './RequestForm';
import UserList from './UserList';
import DisplayItem from '../DisplayItem';

import { withTracker } from 'meteor/react-meteor-data';
import User from '/imports/api/users/User';
import { compose } from 'recompose';


function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: '100%',
  },
});

class AdminTab extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {

    const { users, classes, dataSet, theme, showRemoved, onApprove, onReject} = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            fullWidth={true}
            centered={true}
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
          >
            <Tab label="Requests" />
            <Tab label="Users" />
            <Tab label="History" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
              <RequestForm 
              onApprove={onApprove} 
              onReject={onReject}
              dataSet={dataSet}
              />
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <DisplayItem show xs={12} sm={12}>
              <UserList users={users} showRemoved={showRemoved} />
            </DisplayItem>
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

AdminTab.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// export default withStyles(styles, { withTheme: true })(AdminTab);


export default compose(
  withTracker(() => {
  const usersHandle = Meteor.subscribe('users.all', { includeDeleted: true });

  return {
    loading: !usersHandle.ready(),
    users: User.find({}, {
      disableEvents: true
    }).fetch(),
  };
}),
  withStyles(styles, { withTheme: true })
)(AdminTab);