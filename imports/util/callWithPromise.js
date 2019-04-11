import { Promise } from 'meteor/promise';

/* Call a Meteor method, returning a Promise on the result */
const callWithPromise = (method, ...params) =>
  new Promise((resolve, reject) =>
    Meteor.call(method, ...params, (error, result) => error ? reject(error) : resolve(result))
  )


export default callWithPromise;
