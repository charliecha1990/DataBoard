import Result from '../Result';
import Query from '/imports/api/queries/Query';
import { Products } from '/imports/api/products/Product';
import _ from 'lodash';

import createInstanceMethods from '/imports/api/createInstanceMethods';
import savePromise from '/imports/api/savePromise';

import Color from 'color';
import namer from 'color-namer';
import { hsl, rgb } from 'color-space';

import cluster from './cluster';

createInstanceMethods(Result, 'result', {
  async fetchBrands(result) {
    if (!_.isEmpty(result.brands)) { return; }

    const brands = await Products.rawCollection().aggregate([
      { $match: result.queryObject().matchRules() },
      {
        $addFields: {
          priceLow: { $min: '$sellers.price' },
          priceHigh: { $max: '$sellers.price' },
          priceChanges: { $avg: '$sellers.price_changes' },
          sellout: { $subtract: [100, '$availabilities'] },
        }
      },
      {
        $group: {
          _id: '$brand',
          numProducts: { $sum: 1 },
          priceLow: { $min: '$priceLow' },
          priceHigh: { $max: '$priceHigh' },
          avgPrice: { $avg: '$priceLow' },
          markdowns: { $avg: '$avg_price_changes' },
          avgSellout: { $avg: '$sellout' },
        }
      },
      {
        $addFields: { name: '$_id' }
      },
      {
        $project: {
          _id: false,
        }
      },
      {
        $sort: {
          numProducts: -1,
        }
      },
    ], { allowDiskUse: true, cursor: { batchSize: 300 }, maxTimeMS: 15000 })
      .toArray();

    console.log(`${brands.length} brands matched`);

    result.set({ brands });
    return savePromise(result, { fields: ['brands'] });
  },

  async fetchProductCount(result) {
    if (!_.isEmpty(result.productCount)) { return; }

    const productCountResults = await Products.rawCollection().aggregate([
      { $match: result.queryObject().matchRules() },
      {
        $count: 'count'
      }
    ], { allowDiskUse: true, maxTimeMS: 2000 }).toArray();

    const productCount = _.isEmpty(productCountResults[0]) ? 0 : productCountResults[0].count;

    console.log(`${productCount} products matched`);

    result.set({ productCount });
    return savePromise(result, { fields: ['productCount'] });
  },

  async fetchProductColors(result) {
    if (!_.isEmpty(result.colorClusters)) { return; }

    const productColors = await Products.rawCollection().aggregate([
      { $match: result.queryObject().matchRules() },
      {
        $unwind: '$variants',
      },
      {
        $unwind: '$variants.colors'
      },
      {
        $addFields: {
          hex: '$variants.colors.hex_value',
          percentage: '$variants.colors.percentage',
          rgb: '$variants.colors.rgb',
        }
      },
      {
        $match: {
          percentage: { $gt: 20 }
        }
      },
      {
        $group: {
          _id: '$hex',
          numProducts: { $sum: 1 },
          percentage: { $sum: '$percentage' },
          rgb: { $first: '$rgb' },
          hex: { $first: '$hex'}
        }
      },
      {
        $project: {
          hex: '$_id',
          _id: false,
          percentage: true,
          rgb: true,
          numProducts: true,
        }
      },
    ], { allowDiskUse: true, cursor: { batchSize: 300 }, maxTimeMS: 15000 })
      .toArray();

    console.log(`${productColors.length} colors matched`)

    const clusterBy = color => rgb.hsl(color.rgb);
    const clusters = cluster(productColors, clusterBy);
    const subClusters = clusters.map(({ children }) => cluster(children, clusterBy));

    result.set({
      colorClusters: clusters.map(({ point, children }, index) => ({
        color: hsl.rgb(point),
        children: subClusters[index].map(({ point: subColor, children: subChildren }) => ({
          color: hsl.rgb(subColor),
          name: _.get(namer(Color.rgb(hsl.rgb(subColor)).string(), { pick: ['ntc'] }), ['ntc', 0, 'name']),
          size: _.sumBy(subChildren, 'numProducts')
        })),
        name: _.get(namer(Color.rgb(hsl.rgb(point)).string(), { pick: ['ntc'] }), ['ntc', 0, 'name']),
        size: _.sumBy(subClusters[index], c => _.sumBy(c.children, 'numProducts')),
      })),
    });

    return savePromise(result, { fields: ['colorClusters'] });
  },
});
