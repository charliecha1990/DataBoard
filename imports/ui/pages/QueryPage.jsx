import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import { compose, setDisplayName } from 'recompose';

import withSetStatePromise from '/imports/ui/helpers/withSetStatePromise';


import Brand from '/imports/api/brands/Brand';


import PageBase from '../components/PageBase';



import AddIcon from '@material-ui/icons/Add';

import SearchIcon from '@material-ui/icons/Search';


const styles = theme => ({
  
});


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

    
    return (
      <PageBase
        onAction={this.handleActionButton}
        actionIcon={querySelected ? <SearchIcon /> : <AddIcon />}
        {...props}
      >
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
