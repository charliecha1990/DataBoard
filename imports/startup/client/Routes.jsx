import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
// import i18n from 'meteor/universe:i18n';

// route components
import AppContainerUnsecured from '/imports/ui/containers/AppContainer';
import LoginPage from '/imports/ui/pages/LoginPage';
import EnrollPage from '/imports/ui/pages/EnrollPage';
// import App from '/imports/ui/layouts/App';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import ThemeDefault from '/imports/ui/helpers/theme-default';

import { withUserAuth } from '/imports/ui/helpers/Authorization';
const AppContainer = withUserAuth(AppContainerUnsecured);
i18n.setLocale('en');
const Routes = () => (
  <Router>
    <MuiThemeProvider theme={ThemeDefault}>
      <Switch>
        <Route path="/signin" component={LoginPage} />
        <Route path="/enroll-account" component={EnrollPage} />
        {/* <Route path="/enroll-account/:token" component={EnrollPage} /> */}
        <AppContainer />
      </Switch>
    </MuiThemeProvider>
  </Router>
);

export default Routes;
