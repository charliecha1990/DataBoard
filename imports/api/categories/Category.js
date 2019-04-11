import { Class } from 'meteor/jagi:astronomy';
import createRemoteCollection from '/imports/api/createRemoteCollection';

export const Categories = createRemoteCollection('categories');

Categories.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Category = Class.create({
  name: 'Category',
  collection: Categories,
  fields: {
    name: String,
  },
});

export default Category;
