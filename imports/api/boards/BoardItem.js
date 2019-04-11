import { Class, Enum } from 'meteor/jagi:astronomy';

export const BoardItems = new Mongo.Collection('boardItems');

const BoardItem = Class.create({
  name: 'BoardItem',
  collection: BoardItems,
  fields: {
    // the type of item, determining presentation
    type: Enum.create({
      name: 'ItemType',
      identifiers: {
        image: 'image',
        color: 'color',
        product: 'product',
      }
    }),
    // an opaque object representing the data of the item
    data: Object,
  }
});

export default BoardItem;
