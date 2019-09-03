import { Meteor } from "meteor/meteor";
import authenticatedMethod from "/imports/util/authenticatedMethod";
import User from "../User";

Meteor.publish("currentUser", function() {
  return User.find({ _id: this.userId });
});

Meteor.publish("users.all", authenticatedMethod("admin", function({ includeDeleted } = { includeDeleted: false }) {
  // http://jagi.github.io/meteor-astronomy/v2#softremove
  return User.find({}, {
    disableEvents: includeDeleted
  });
}));

Meteor.publish("users", function() {
  return User.find({}, {fields:{"profile.firstName":1, "profile.lastName":1,"emails":1}});
});

