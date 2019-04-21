import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withMessageContext } from '/imports/ui/helpers/MessageContext';

import Board from './Board';
import ConfirmDeleteBoard from './ConfirmDeleteBoard';

class BoardContainer extends React.Component {
  state = {
    lastLayout: [],
    presentationMode: false,
    menu: false,
    showConfirmDeleteBoard: false,
  }

  handleChange = (field, value) => {
    this.props.board.set({ [field]: value });
    this.props.board.save();
  }

  handleLayoutChange = (nextLayout) => {
    const board = this.props.board;
    if (!board || _.isEqual(nextLayout, this.state.lastLayout) || _.isEqual(nextLayout, board.layoutForReactGrid())) {
      return;
    }

    this.setState({ lastLayout: nextLayout },
      () => board.setLayout(nextLayout));
  }

  handleAddImages = e => {
    const files = e.target.files;

    this.handleFileChange({ files });
  }

  handleRemoveItem = id => {
    this.props.board.removeItem(id);
  }

  toggleMenu = (ev) => {
    this.setState({
      menuAnchorEl: ev.currentTarget,
      menu: !this.state.menu
    })
  }

  setConfirmDeleteBoard = (value) => {
    this.setState({
      showConfirmDeleteBoard: value,
      menu: false,
    });
  }

  onConfirmDeleteBoard = () => {
    const name = this.props.board.name;

    this.props.board.delete()
      .then(() => this.setState({ showConfirmDeleteBoard: false }))
      .then(() => this.props.pushMessage(`${name} deleted.`))
      .then(() => this.props.history.push('/boards'))
  }

  render() {
    const { board, loading } = this.props;
    const {
      showConfirmDeleteBoard,
      menu,
      menuAnchorEl,
      presentationMode
    } = this.state;

    return board ?
      <React.Fragment>
        <Board
          board={board}
          handleLayoutChange={this.handleLayoutChange}
          handleFileChange={this.handleFileChange}
          addImages={this.handleAddImages}
          handleRemoveItem={this.handleRemoveItem}
          toggleMenu={this.toggleMenu}
          presentationMode={presentationMode}
          menu={menu}
          menuAnchorEl={menuAnchorEl}
          deleteBoard={this.setConfirmDeleteBoard.bind(this, true)}
          loading={loading} />
        <ConfirmDeleteBoard
          open={showConfirmDeleteBoard}
          onClose={this.setConfirmDeleteBoard.bind(this, false)}
          onConfirmDelete={this.onConfirmDeleteBoard}
          name={board.name}
        />
      </React.Fragment>
      : null;
  }
}

export default compose(
  withTracker(
    props => {
      const boardsHandle = Meteor.subscribe('boards');

      return {
        loading: !boardsHandle.ready(),
      }
    }
  ),
  withMessageContext,
  withRouter
)(BoardContainer);
