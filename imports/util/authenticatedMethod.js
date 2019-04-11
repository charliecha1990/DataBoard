import User, { userHasRole } from '/imports/api/users/User';

const authenticatedMethod = (role, method) => (...args) => {
  const userId = Meteor.userId();
  const user = User.findOne(userId);

  if (userHasRole(user, role)) {
    return method(...args);
  } else {
    throw 'Unauthorized';
  }
};

export default authenticatedMethod;
