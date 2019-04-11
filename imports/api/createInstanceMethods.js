import callWithPromise from '/imports/util/callWithPromise';

/* Define instance methods for an Astronomy model */
/* This will result in two definitions:
 *  1. a Meteor method with name name.method(id) which calls the function
 *  2. an Astronomy helper convenience method which invokes this Meteor method,
 *     passing the ID of the instance.
 */
 /* Note that you *must* define an authorize() helper on the model, which will
  * be called before invoking each method. authorize should return a Promise
  * which rejects on unauthorized access. */
const createInstanceMethods = (klass, name, instanceMethods) => {
  _.keys(instanceMethods).map(method => {
    const meteorMethodName = `${name}.${method}`;
    /* Define Meteor methods for instance methods */
    Meteor.methods({
      async [meteorMethodName](doc, ...args) {
        doc.authorize();
        return await instanceMethods[method](doc, ...args);
      }
    });

    /* Define Astronomy instance methods to invoke Meteor methods with Promise */
    /* Note that for some reason, defining the actual asynchronous body of the
     * method here leads to parallellism issues, so we simply invoke the Meteor
     * method, passing along our own ID, as a convenience method.
     */
    /* http://jagi.github.io/meteor-astronomy/v2#helpers */
    klass.extend({
      helpers: {
        [method](...args) {
          return callWithPromise(meteorMethodName, this, ...args);
        }
      }
    })
  });
}

export default createInstanceMethods;
