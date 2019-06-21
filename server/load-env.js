/**
  Ensure that env variables are loaded before other crucial module loading.
  Usage:
  import loadEnv from '/imports/startup/both/load-env';

  loadEnv.then(() => require('./my-module'));
**/
import path from 'path';
import dotenv from 'dotenv';

const loadEnv = new Promise((resolve, reject) => {
  const result = dotenv.config({
    path: path.resolve(process.env.PATH || `${process.env.PWD}`+'/.env.meteor.example')
  });
  // console.log("Env path ",process.env.PATH);
  // console.log("Env pwd ",process.env.PWD);
  resolve();
  // if (result.error) {
  //   console.log(process.env.PWD);
  //   reject(result.error);
  // } else {
  //   resolve();
  // }
});

export default loadEnv;
