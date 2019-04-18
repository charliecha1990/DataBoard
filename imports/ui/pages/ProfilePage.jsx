import React from 'react';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';

import PageBase from '../components/PageBase';
import BoardContainer from '../components/boards/BoardContainer';
import BoardsListContainer from '../components/boards/BoardsListContainer';
import NewBoard from '../components/boards/NewBoard';

import AddIcon from '@material-ui/icons/Add';



const styles = _theme => ({
})

class BoardsPage extends React.Component {

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
    const { boards, loading, classes, match, ...props } = this.props;

    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon />}
        onAction={this.addBoard}
      >
      </PageBase>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(BoardsPage);
