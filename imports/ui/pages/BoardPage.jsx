import React from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import PageBase from '../components/PageBase';
import EnhancedTable from '../components/Profile/EnhancedTable';




const styles = _theme => ({
})

class BoardPage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}]
      ] 
    }
  }

  render() {
    const { dataSets, loading, classes, match, ...props } = this.props;
    // const {  } = this.state;

    console.log(dataSets)
    
    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon />}
        onAction={this.addBoard}
      >
        <EnhancedTable/>
      </PageBase>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(BoardPage);
