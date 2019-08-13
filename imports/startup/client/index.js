import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';
import './register-api';
// import "./insertRandomData";

import Routes from '/imports/startup/client/Routes';

Meteor.startup(() => {
  render(
    <Routes />,
    document.getElementById('app')
  );
});


