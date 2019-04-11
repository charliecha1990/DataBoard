import { Class } from 'meteor/jagi:astronomy';
import createRemoteCollection from '/imports/api/createRemoteCollection';

export const Brands = createRemoteCollection('brands');

Brands.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const Brand = Class.create({
  name: 'Brand',
  collection: Brands,
  fields: {
    name: String,
    logo: String,
  },
});

export default Brand;
