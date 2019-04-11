import _ from 'lodash';

import Board, { COLUMNS } from './Board';
import BoardItem from './BoardItem';
import LayoutItem from './LayoutItem';

import createInstanceMethods from '/imports/api/createInstanceMethods';

// map react-grid-layout keys to BoardItem keys
const mapVendorKeys = {
  i: 'boardItemId',
  w: 'width',
  h: 'height',
}

createInstanceMethods(Board, 'board', {
  async addItem(board, itemId) {
    const item = BoardItem.findOne(itemId);

    const x = (board.items.length * 2) % COLUMNS
    const column = board.items.filter(i => i.x == x);
    const layoutItem = new LayoutItem({
      boardItemId: itemId,
      x,
      y: _.get(_.maxBy(column, 'y'), 'y', 0) + 1, // bottom of column
      width: 2,
      height: 8
    });

    board.items.push(item);
    board.layout.push(layoutItem);
    board.save({ cast: true, fields: ['items', 'layout', 'updatedAt'] });
  },

  async addItemRaw(board, item) {
    new BoardItem(item).save((err, id) => err ? throw(err) : board.addItem(id))
  },

  async addImage(board, src) {
    board.addItemRaw({
      type: 'image',
      data: {
        src
      }
    });
  },

  async addColor(board, hex) {
    board.addItemRaw({
      type: 'color',
      data: {
        hex
      }
    });
  },

  async removeItem(board, id) {
    let items = board.items.slice();
    let layout = board.layout.slice();
    _.remove(items, { '_id': id });
    _.remove(layout, { boardItemId: id });

    board.set({
      items,
      layout
    });
    board.save({ cast: true, fields: ['items', 'layout', 'updatedAt']});
  },

  async setLayout(board, layout) {
    const newLayout = layout.map(item => _.mapKeys(item, (_v, key) => (mapVendorKeys[key] || key)));

    board.set({ layout: newLayout });
    board.save({ cast: true, fields: ['layout', 'updatedAt'] });
  },

  async delete(board) {
    board.softRemove();
  }
});

Meteor.methods({
  async 'boards.create'(params = {}) {
    const board = new Board(Object.assign({}, params, { userId: Meteor.userId() }));

    return new Promise((res, rej) =>
      board.save((err, id) => err ? rej(err) : res(id))
    );
  }
});
