import Brand from './Brand';
import { Products } from '../products/Product';

Meteor.methods({
  async 'brands.refresh'() {
    const brandDocuments = await Products.rawCollection().aggregate([
      {
        $group: {
          _id: '$brand'
        },
      },
      {
        $project: {
           _id: false,
           name: '$_id'
        },
      }
    ]).toArray();
    brandDocuments.forEach(({ name }) => {
      const brand = Brand.findOne({ name }) || new Brand();
      brand.set({ name });
      brand.save();
    });
  }
});
