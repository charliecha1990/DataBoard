import Category from './Category';
import { Products } from '../products/Product';

Meteor.methods({
  async 'categories.refresh'() {
    const categoryDocuments = await Products.rawCollection().aggregate([
      {
        $unwind: '$categories'
      },
      {
        $group: {
          _id: '$categories'
        },
      },
      {
        $project: {
           _id: false,
           name: '$_id'
        },
      }
    ]).toArray();
    categoryDocuments.forEach(({ name }) => {
      const category = Category.findOne({ name }) || new Category();
      category.set({ name });
      category.save();
    });
  }
});
