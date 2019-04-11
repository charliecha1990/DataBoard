import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { compose, setDisplayName } from 'recompose';
import callWithPromise from '/imports/util/callWithPromise';
import withSetStatePromise from '/imports/ui/helpers/withSetStatePromise';
import classNames from 'classnames';

import Brand from '/imports/api/brands/Brand';
import Query from '/imports/api/queries/Query';

import PageBase from '../components/PageBase';
import QueryControls from '../components/QueryControls';
import QueryCard from '../components/QueryCard';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SearchIcon from '@material-ui/icons/Search';

import { TransitionGroup } from 'react-transition-group';

import { STACKING_BAR_HEIGHT, Z_INDEX_STACKING_BAR } from '/imports/ui/helpers/constants';

const styles = theme => ({
  container: {
    padding: 8,
    flex: 1,
    marginTop: theme.spacing.unit,
  },
  root: {
    margin: theme.spacing.unit,
    padding: 24,
    maxWidth: 1024,
  },
  collapse: {
    width: '100%',
  },
  card: {
    margin: theme.spacing.unit * 2,
    maxWidth: 1024,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  overflowVisible: {
    overflow: 'visible'
  }
});

const QueryCardWrapper = withStyles(styles)(({ in: inProp, classes, ...props }) => (
  <Collapse className={classes.collapse} in={inProp}>
    <QueryCard className={classes.card} {...props} />
  </Collapse>
));

class QueryPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      queryId: props.query._id,
      queryControlsIn: false,
      showQueryOverflow: false,
    }

    this.queryTransitionPromise = Promise.resolve();
  }

  componentDidMount() {
    this.setState({ queryControlsIn: true });
  }

  // wait for current query from props if none selected
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (_.isEmpty(prevState.queryId) && !_.isEmpty(nextProps.query._id)) {
  //     return {
  //       queryId: nextProps.query._id,
  //       queryControlsIn: true,
  //     }
  //   }
  // }

  hideQueryControls = () => {
    this.queryTransitionPromise = this.queryTransitionPromise
        .then(() => this.setStatePromise({
          showQueryOverflow: false,
          queryControlsIn: false
        }));
    return this.queryTransitionPromise;
  }

  handleSelectQuery = (id) => {
    if (id === this.props.query._id) { return; }

    this.queueAction(() =>
      this.props.handleSelectQuery(id)
          .then(() => this.setStatePromise({ queryControlsIn: true }))
    );
  }

  handleUnselectQuery = () => {
    this.queueAction(() =>
      this.props.handleSelectQuery('')
    );
  }

  handleAddQuery = async () => {
    this.queueAction(this.addQuery)
  }

  handleDeleteQuery = (id) => {
    Query.findOne(id).softDelete();
  }

  queueAction = (action) => {
    if (_.isEmpty(this.props.query)) {
      this.queryTransitionPromise
          .then(action)
    } else {
      this.onQueryExitAction = action;
      this.hideQueryControls();
    }
  }

  addQuery = () =>
    callWithPromise('queries.new')
      .then(id => this.handleSelectQuery(id))
      .then(() => this.setStatePromise({ queryControlsIn: true }))

  /* if the query editor has exited, it means we've already changed queries,
   * so bring it back into view */
  onQueryExitEnd = () => {
    this.queryTransitionPromise = this.queryTransitionPromise
        .then(this.onQueryExitAction)
  }

  onQueryEntered = () => {
    this.setState({ showQueryOverflow: true });
  }

  runQuery = async () => {
    this.props.runQuery();
    this.props.history.push({
      pathname: '/insights',
      search: this.props.location.search,
    });
  }

  handleActionButton = () => {
    if (this.props.querySelected) {
      this.runQuery();
    } else {
      this.handleAddQuery();
    }
  }

  render() {
    const {
      handleChangeQuery,
      query,
      querySelected,
      querySuccess,
      saving,
      brands,
      categories,
      classes,
      ...props
    } = this.props;

    const { queryControlsIn } = this.state;

    const queries = this.props.queries.map(q => Object.assign({}, q.raw(), { description: q.description() }));

    return (
      <PageBase
        onAction={this.handleActionButton}
        actionIcon={querySelected ? <SearchIcon /> : <AddIcon />}
        {...props}
      >
        <Grid container justify="center" className={classes.container}>
          <Collapse in={!_.isEmpty(query) && queryControlsIn}
              className={classNames({ [classes.overflowVisible]: this.state.showQueryOverflow })}
              onEntered={this.onQueryEntered}
              onExited={this.onQueryExitEnd}>
            <Paper className={classes.root}>
              <QueryControls
                onChange={handleChangeQuery}
                onSubmit={this.runQuery}
                onClose={this.handleUnselectQuery}
                query={query}
                brands={brands}
                categories={categories}
                querySuccess={querySuccess}
                saving={saving}
                />
            </Paper>
          </Collapse>
          <TransitionGroup component={null}>
            { queries.filter(q => q._id !== query._id).map(q => (
              <QueryCardWrapper
                key={q._id}
                handleSelect={this.handleSelectQuery}
                handleDelete={this.handleDeleteQuery}
                query={q}
              />
            )) }
          </TransitionGroup>
          { queries.length === 0 &&
              <Grid item xs={12}>
                <Typography variant="headline" align="center">
                  Tap <AddCircleIcon style={{ transform: 'translateY(3px)' }} /> to get started.
                </Typography>
              </Grid>
          }
        </Grid>
      </PageBase>
    );
  }
}

export default compose(
  withTracker(() => {
    const brandsHandle = Meteor.subscribe('brands');

    return {
      loading: !brandsHandle.ready(),
      brands: _.sortBy(Brand.find().fetch(), 'name'),
    };
  }),
  withRouter,
  withStyles(styles),
  withSetStatePromise,
  setDisplayName('QueryPage'),
)(QueryPage);
