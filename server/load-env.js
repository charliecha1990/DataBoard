/**
  Ensure that env variables are loaded before other crucial module loading.
  Usage:
  import loadEnv from '/imports/startup/both/load-env';

  loadEnv.then(() => require('./my-module'));
**/
import path from "path";
import dotenv from "dotenv";

const loadEnv = new Promise((resolve, reject) => {
    const result = dotenv.config({
        path: path.resolve(
            process.env.ENV_PATH || `${process.env.PWD}/.env.meteor`
        )
    });

    if (result.error) {
        reject(result.error);
    } else {
        resolve();
    }
});

export default loadEnv;
