import React from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import PageBase from '../components/PageBase';
import EnhancedTable from '../components/Profile/EnhancedTable';
import PersonalTable from '../components/Profile/PersonalTable';





const styles = _theme => ({
})

class ProfilePage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}]
      ]
    }
  }

  addBoard = () => this.props.history.push(`${this.props.match.url}/new`)

  handleSelect = id => this.props.history.push(`${this.props.match.url}/${id}`)

  resetRoute = () => this.props.history.push(this.props.match.url);

  render() {
    const { dataSets, loading, classes, match, ...props } = this.props;
    // const {  } = this.state;

    console.log(dataSets)
    
    return (
      <PageBase
        {...props}
        // actionIcon={<AddIcon />}
        // onAction={this.addBoard}
      >
        <PersonalTable/>
        <EnhancedTable/>
      </PageBase>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(ProfilePage);
