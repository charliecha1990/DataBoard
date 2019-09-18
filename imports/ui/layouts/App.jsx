import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import withSetStatePromise from '/imports/ui/helpers/withSetStatePromise';
import _ from 'lodash';
import { compose } from 'recompose';


import MessageContext from '/imports/ui/helpers/MessageContext';

import NotFoundPage from '/imports/ui/pages/NotFoundPage';
import ErrorModal from '../components/ErrorModal';
import Message from '../components/Message';
import StickyMessage from '../components/StickyMessage';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { generateRoutes } from '/imports/ui/helpers/routes';
import withDateUtils from '/imports/ui/helpers/withDateUtils';

import { TransitionGroup } from 'react-transition-group';

const styles = theme => ({
  '@global body': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  '@global body, h1, h2, h3, h4, h5, h6': {
    fontSize: '15px',
    margin: '0',
    lineHeight: '24px',
    color: '#212121',
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  /* Hold content fixed */
  contentPane: {
    position: 'relative',
    flexGrow: 2,
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: theme.palette.background.default,
    // padding: 24,
    // marginBottom: BOTTOM_NAV_HEIGHT + 24,
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  offlineMessageProgress: {
    marginRight: 10,
  },
});

const PageRoute = ({ key, path, exact, component: Component, location, computedMatch, ...componentProps }) => (
  <Route key={key} path={path} exact={exact} render={() => <Component {...componentProps} />} />
);

const PageTransitionGroup = ({ children }) => (
  <TransitionGroup component={null}>
    { children }
  </TransitionGroup>
);

const OfflineMessageBody = withStyles(styles)(({ classes }) =>
  <Grid container>
    <Grid item className={classes.offlineMessageProgress}>
      <CircularProgress size={20} />
    </Grid>
    <Grid item>
      <span>You seem to be offline. Connecting...</span>
    </Grid>
  </Grid>
)

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      changes: {},
      querySuccess: false,
      saving: false,
      error: {},
      messages: new Set(),
    };

    this.queryStatusPromise = Promise.resolve();
    this.saveQueryPromise = Promise.resolve();

    this.saveQuery = _.debounce(this.saveQueryNow, 500);
  }

  /* NOTE: this reports then swallows the exception, so it should be the end of any
   * catch/throw chain */
  captureException = (error, extra) => {
    Raven.captureException(error, {
      extra: Object.assign({},
        {
          queryProp: this.props.query,
          queryState: this.state.query,
        },
        extra
      )
    });
  }

  saveQueryNow = () => {
    this.saveQueryPromise = this.saveQueryPromise.then(() =>
      this.setStatePromise({ saving: true })
        .then(() => this.props.query.upsert(this.state.changes))
        .then(id => this.props.query._id || this.setQueryId(id))
        .then(this.setQuerySuccess)
        .catch(this.setQueryError)
        .catch(err => {
          throw(err);
        })
        .catch(error => this.captureException(error, { state: this.state, props: this.props }))
        .finally(() => this.setStatePromise({ saving: false }))
    )

    return this.saveQueryPromise;
  }

  setQueryId = queryId => this.props.setSession({ queryId });

  /* Chain query success and error indicators, resolving with a timeout instance that can be
   * canceled and set again.
   * Note that we *don't* return this.queryStatusPromise, to prevent
   * accidentally intercepting it and thus losing the timeout value */
  setQueryStatus = (key) => {
    this.queryStatusPromise = this.queryStatusPromise.then(
      timeout => new Promise(resolve => {
        if (timeout) {
          clearTimeout(timeout);
        }
        const resetSuccess = () => this.setState({ [key]: false })
        this.setState({ [key]: true }, () => resolve(setTimeout(resetSuccess, 5000)))
      })
    )
  }

  setQuerySuccess = () => this.setQueryStatus('querySuccess')

  setQueryError = err => {
    this.setState({
      error: {
        title: 'Error Saving Query',
        text: 'There was an error with that query. Please try again.\
               If this persists, please contact us.'
      }
    });
    throw err;
  };

  /* Record query changes */
  handleChangeQuery = (field) => async (value) => {
    const change = _.isEmpty(field) ? value : { [field]: value };
    const changes = Object.assign({}, this.state.changes, change)

    this.setState({ changes }, this.saveQuery);
  }

  handleSelectQuery = (id) => this.saveQueryPromise
    .then(() => this.props.setQueryId(id))
    .then(() => this.setStatePromise({ changes: {} }))

  runQuery = () =>
    this.saveQueryNow()
        .then(() => {
          const query = Query.findOne(this.props.query._id);
          if (query.running) {
            return Promise.resolve();
          }

          return query.run()
            .catch(error => this.captureException(error))
              .then(() => query.reset());
        })

  logout = () => {
    Meteor.logout()
  }

  resetError = () => {
    this.setState({ error: {} });
  }

  pushMessage = messageText => {
    const messages = new Set(this.state.messages);
    messages.add(messageText);
    this.setState({ messages });
  }

  handleCloseMessage = message => {
    const messages = new Set(this.state.messages);
    messages.delete(message);
    this.setState({ messages });
  }

  render() {
    const { changes, querySuccess, messages, saving, error } = this.state;
    const { query, querySelected, classes, location, connected } = this.props;
    const _currentKey = location.pathname.split('/')[1] || '/';

    const addDescription = _.isEmpty(query) ? {} : { description: query.description() };

    /* Add user changes on top of ground truth query */
    const modifiedQuery = Object.assign({}, query, changes, addDescription);

    return (
      <React.Fragment>
        { connected || <StickyMessage message={<OfflineMessageBody />} /> }
        <CssBaseline />
        <div className={classes.container}>
          <MessageContext.Provider value={this.pushMessage}>
            {/* Unfortunately we have to manage our own routes, because Switch doesn't give us
              * a good way to pass props to its children */}
            <Switch location={location}>
              <PageTransitionGroup>
                { generateRoutes().map(({ link, hasSubRoutes, component }) => (
                  /* Top line: Route props, rest are spread to component */
                  <PageRoute key={link} path={link} exact={!hasSubRoutes} component={component}
                    runQuery={this.runQuery}
                    handleChangeQuery={this.handleChangeQuery}
                    handleSelectQuery={this.handleSelectQuery}
                    query={modifiedQuery}
                    querySelected={querySelected}
                    querySuccess={querySuccess}
                    saving={saving}
                    loading={this.props.loading}
                    brands={this.props.brands}
                    categories={this.props.categories}
                  />
                )) }
              </PageTransitionGroup>
              <Route component={NotFoundPage} />
            </Switch>
            { [...messages].map(message =>
                <Message key={message} message={message} handleClose={this.handleCloseMessage.bind(this, message)} />
              )
            }
          </MessageContext.Provider>
        </div>
        <ErrorModal title={error.title} text={error.text} onClose={this.resetError} />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  classes: PropTypes.object,
  width: PropTypes.string,
  query: PropTypes.object,
};

export default compose(
  withStyles(styles),
  withSetStatePromise,
  withDateUtils
)(App);