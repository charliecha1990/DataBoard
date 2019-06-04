import loadEnv from "./load-env";
import Raven from "raven";
import { Meteor } from "meteor/meteor";

import DataSet, { DataSets } from "../imports/api/dataSet/DataSet";

/*
  First, load environment variables. loadEnv will contain a promise which will
  resolve once the env has successfully loaded. If this doesn't happen, the app
  won't start.

  Then, set up Sentry error reporting, running the rest of the server within
  a Raven context.
*/

loadEnv.then(() => {
    Raven.config(process.env.SENTRY_SERVER_URL).install();

    Raven.context(function() {
        Meteor.startup(() => {
            require("/imports/startup/server");
            require("/imports/startup/both");
        });
    });
});

Meteor.publish("dataSet", function() {
    if (!this.userId) {
        return this.ready();
    }
    return DataSet.find({ userId: Meteor.userId() });
});

Meteor.publish("dataSets", function() {
    if (!this.userId) {
        return this.ready();
    }
    return DataSet.find({});
});
