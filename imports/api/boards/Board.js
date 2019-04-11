import { Class } from 'meteor/jagi:astronomy';

export const Boards = new Mongo.Collection('boards');

import LayoutItem from './LayoutItem';
import BoardItem from './BoardItem';

export const COLUMNS = 12;

Boards.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Board = Class.create({
  name: 'Board',
  collection: Boards,
  fields: {
    userId: String,
    name: String,
    items: {
      type: [BoardItem],
      default: [],
    },
    layout: {
      type: [LayoutItem],
      default: [],
    }
  },
  behaviors: {
    timestamp: {
      hasUpdatedField: true,
      updatedFieldName: 'updatedAt',
    },
    softremove: {
      removedFieldName: 'removed',
      hasRemovedAtField: true,
      removedAtFieldName: 'removedAt'
    },
  },
  helpers: {
    authorize() {
      if (this.userId !== Meteor.userId()) { throw 'Unauthorized'; }
    },
    layoutForReactGrid() {
      return this.layout.map(
        ({ boardItemId, x, y, width, height }) => ({ i: boardItemId, x, y, w: width, h: height })
      );
    }
  }
});

export default Board;
