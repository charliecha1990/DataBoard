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
        <Route exact path={`${match.url}/new`}
          render={props => <NewBoard onCreated={this.handleSelect} onClose={this.resetRoute} {...props} />} />
        <Switch>
          <Route
            exact
            path={`${match.url}/:boardId`}
            render={props => <BoardContainer loading={loading} {...props} />} />
          <Route
            render={props => <BoardsListContainer onSelect={this.handleSelect} {...props} />} />
        </Switch>
      </PageBase>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(BoardsPage);
