import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";

import withSession from "/imports/ui/helpers/withSession";
import { compose, setDisplayName } from "recompose";

import User from "/imports/api/users/User";


import App from "/imports/ui/layouts/App";

export default compose(
  setDisplayName("AppContainer"),
  withRouter,
  withSession("AppContainerOptions", { messages: new Set() }),
  withTracker(props => {
    const queryHandle = Meteor.subscribe("queries.currentUser");
    const userHandle = Meteor.subscribe("currentUser");
    const brandsHandle = Meteor.subscribe("brands");
    const categoriesHandle = Meteor.subscribe("categories");
    const userId = Meteor.userId();
    const user = User.findOne(userId);
    
    return {
      loading: !(queryHandle.ready() &&
        userHandle.ready() &&
        brandsHandle.ready() &&
        categoriesHandle.ready()) ||
        _.isEmpty(user),
      connected: Meteor.status().connected,
      user
    };
  })
)(App);
