import loadEnv from "./load-env";
import Raven from "raven";

/*
  First, load environment variables. loadEnv will contain a promise which will
  resolve once the env has successfully loaded. If this doesn't happen, the app
  won't start.

  Then, set up Sentry error reporting, running the rest of the server within
  a Raven context.
*/

loadEnv.then(() => {
  Raven.config(process.env.SENTRY_SERVER_URL).install();
  // console.log('Starting server.....');
  Raven.context(function() {
    Meteor.startup(() => {
      // console.log(dataSet.find().fetch());
      require("/imports/startup/server");
      require("/imports/startup/both");
    });
  });
});
