import User from './User';
import authenticatedMethod from '/imports/util/authenticatedMethod';
import createInstanceMethods from '/imports/api/createInstanceMethods';

import { Accounts } from 'meteor/accounts-base';

createInstanceMethods(User, 'user', {
  setRole: authenticatedMethod('admin', async (user, role, shouldHaveRole) => {
    const roles = new Set(user.roles);
    shouldHaveRole ? roles.add(role) : roles.delete(role);
    user.set({ roles: Array.from(roles.values()) });
    user.save();
  }),

  softDelete: authenticatedMethod('admin', async (user) => {
    user.softRemove();
  }),

  restore: authenticatedMethod('admin', async (user) => {
    user.softRestore();
  }),
});

Meteor.methods({
  async 'user.currentResults'(currentResults) {
    const userId = Meteor.userId();
    const user = User.findOne(userId);
    user.set({ currentResults });
    user.validate();
    user.save();
  },

  /* Create a user without logging in as that user (server-side only) */
  /* Note that you need to set a password (see Accounts#setPassword)
   * before the user can log in, but we don't do so here to avoid
   * sending a password over cleartext */
  'users.create': authenticatedMethod('admin', (email) => {
    if (Meteor.isClient) { return; }

    const userId = Accounts.createUser({ email });
    Accounts.sendEnrollmentEmail(userId);
  }),

  async 'users.findByToken'(token) {
    return User.findOne({ "services.password.reset.token": token });
  }
});
