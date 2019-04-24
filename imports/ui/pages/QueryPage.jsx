import React from 'react';
import { compose, setDisplayName } from 'recompose';

import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import withSetStatePromise from '/imports/ui/helpers/withSetStatePromise';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import PageBase from '../components/PageBase';




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
    const { classes, ...props } = this.props;

    
    return (
      <PageBase
        {...props}
      >
      </PageBase>
    );
  }
}

export default compose(
  withTracker(() => {


    return {
    };
  }),
  withRouter,
  withStyles(styles),
  withSetStatePromise,
  setDisplayName('QueryPage'),
)(QueryPage);
