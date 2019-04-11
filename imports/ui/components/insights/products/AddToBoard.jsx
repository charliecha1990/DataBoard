import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'recompose';

import Fuse from 'fuse.js'

import Board from '/imports/api/boards/Board';

import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import CloseButton from '/imports/ui/components/CloseButton';
import Loading from '/imports/ui/components/Loading';

const styles = _theme => ({
  container: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // width: '100%',
    // height: '100%',
    // background: 'rgba(0,0,0,0.8)',
    height: 400,
    width: 400,
    transform: 'translateY(-48px)'
  },
  scrollContainer: {
    width: '100%',
    height: 400 - 48,
    overflowY: 'scroll',
  }
});

class AddToBoard extends React.PureComponent {
  fuseOptions = {
    shouldSort: true,
    tokenize: true,
    findAllMatches: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'name'
    ]
  }

  state = {
    searchResults: [], // { item: (original board), matches: (indices of matches) }
    searchText: '',
  }

  handleAdd = (board) => {
    board.addItemRaw(this.props.item)
      .then(this.props.handleClose)
  }

  setSearchText = (ev) => {
    ev.preventDefault();

    const newText = ev.target.value;
    if (newText === this.state.searchText) { return; }

    let searchResults = [];

    if (newText)  {
      const fuse = new Fuse(this.props.boards, this.fuseOptions);
      searchResults = this.mapSearchResults(fuse.search(newText));
    }

    this.setState({
      searchText: ev.target.value,
      searchResults
    });
  }

  mapSearchResults = (rawResults) =>
    rawResults.map(({ board, matches }) => {
      const openingIndices = matches[0].indices.map(pair => pair[0]);
      const closingIndices = matches[0].indices.map(pair => pair[1]);
      return {
        board,
        display: board.name.split('').flatMap((ch, idx) => {
          let res = [];
          if (openingIndices.includes(idx)) {
            res.push('<span style="font-weight: bold">');
          }
          res.push(ch);
          if (closingIndices.includes(idx)) {
            res.push('</span>');
          }

          return res;
        }).join('')
      };
    })

  render() {
    const { open, boards, handleClose, anchorEl, classes, loading } = this.props;
    const { searchText, searchResults } = this.state;

    const latest = _.maxBy(boards, 'updatedAt');

    const boardItems = searchText ?
      searchResults :
      boards.map(board => ({
        board,
        display: board.name
      }));

    const BoardList = (
      <List
        subheader={
          <ListSubheader>Add to Board
            <CloseButton
              onClick={handleClose}
              style={{ top: '50%', right: 4, transform: 'translateY(-50%)' }}
              size="small" />
          </ListSubheader>
        }>
        <div className={classes.scrollContainer}>
          { latest && <ListItem button onClick={() => this.handleAdd(latest)}>{ latest.name }</ListItem> }
          <ListItem dense>
            <TextField
              fullWidth
              id="boardSearch"
              onChange={this.setSearchText}
              type="text"
              label=""
              value={searchText}
              placeholder="Find your board..."
              margin="dense"
              InputProps={{
                disableUnderline: true,
              }}
              />
          </ListItem>
          <Divider />
          { boardItems.map(({ board, display }) =>
              <ListItem key={board._id} button onClick={() => this.handleAdd(board)}>
                <span dangerouslySetInnerHTML={{ __html: display }} />
              </ListItem>
            )
          }
        </div>
      </List>
    );

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        classes={{ paper: classes.container }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 48,
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            // backgroundImage: `url(${_.get(product, ['images_urls', 0])})`
          }
        }}
      >
        { loading ? <Loading /> : BoardList }
      </Popover>
    );
  }
}

AddToBoard.propTypes = {
  open: PropTypes.bool.isRequired,
  boards: PropTypes.arrayOf(PropTypes.instanceOf(Board)).isRequired,
  item: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
}

export default compose(
  withStyles(styles),
  withTracker(_props => {
    const boardsHandle = Meteor.subscribe('boards');

    return {
      boards: Board.find({ userId: Meteor.userId() }).fetch(),
      loading: !boardsHandle.ready(),
    };
  }),
)(AddToBoard);
