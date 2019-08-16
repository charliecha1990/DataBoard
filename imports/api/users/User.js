import { Class } from "meteor/jagi:astronomy";
import _ from "lodash";

export const Users = Meteor.users;

Users.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const User = Class.create({
  name: "User",
  collection: Users,
  fields: {
    profile: {
      type: Object,
      fields:{
        firstName: String,
        lastName: String
      },
      optional: true
    },
    roles: {
      type: [String],
      optional: true
    },
    emails: {
      type: [Object],
      optional: false
    },
    services: {
      type: Object,
      optional: false
    },
    createdAt: {
      type: Date,
      optional: false
    }
  },
  behaviors: {
    timestamp: {
      hasUpdatedField: true,
      updatedFieldName: "updatedAt"
    },
    softremove: {
      removedFieldName: "removed",
      hasRemovedAtField: true,
      removedAtFieldName: "removedAt"
    }
  },
  helpers: {
    authorize() {
      if (!userHasRole(User.findOne(Meteor.userId()), "admin")) {
        throw "Unauthorized";
      }
    },

    email() {
      return _.get(this.emails, [0, "address"], "");
    }
  }
});

export const userHasRole = (user, role) => {
  const roles = user.roles || ["user"];
  return roles.includes(role);
};

export default User;
