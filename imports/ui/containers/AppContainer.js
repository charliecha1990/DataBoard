import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import withQueryParams from "/imports/ui/helpers/withQueryParams";
import withSession from "/imports/ui/helpers/withSession";
import { compose, setDisplayName } from "recompose";

import User from "/imports/api/users/User";
import Brand from "/imports/api/brands/Brand";
import Category from "/imports/api/categories/Category";
import Query from "/imports/api/queries/Query";

import App from "/imports/ui/layouts/App";

export default compose(
  setDisplayName("AppContainer"),
  withRouter,
  withQueryParams({ query: "queryId" }),
  withSession("AppContainerOptions", { messages: new Set() }),
  withTracker(props => {
    const queryHandle = Meteor.subscribe("queries.currentUser");
    const userHandle = Meteor.subscribe("currentUser");
    const brandsHandle = Meteor.subscribe("brands");
    const categoriesHandle = Meteor.subscribe("categories");
    const userId = Meteor.userId();
    const user = User.findOne(userId);
    const query = Query.findOne(props.queryId);
    const querySelected = _.isEmpty(props.queryId); // made a hack here, have to go back to !

    return {
      loading: !(queryHandle.ready() &&
        userHandle.ready() &&
        brandsHandle.ready() &&
        categoriesHandle.ready()) ||
        _.isEmpty(user),
      brands: Brand.find().fetch(),
      categories: Category.find().fetch(),
      connected: Meteor.status().connected,
      setQueryId: id => props.setQueryParam("query", id),
      query,
      querySelected,
      user
    };
  })
)(App);
