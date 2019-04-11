import { Class } from 'meteor/jagi:astronomy';

const LayoutItem = Class.create({
  name: 'LayoutItem',
  fields: {
    boardItemId: String,
    x: {
      type: Number,
      required: true,
      default: 0
    },
    y: {
      type: Number,
      required: true,
      default: 0
    },
    width: {
      type: Number,
      required: true,
      default: 1
    },
    height: {
      type: Number,
      required: true,
      default: 10
    },
  }
});

export default LayoutItem;
