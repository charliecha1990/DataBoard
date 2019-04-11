import Result from '../Result';

Meteor.publish('result.refineBrand', function(id, brand) {
  const result = Result.findOne(id);
  if (!result) { throw 'Not found'; }
  result.authorize();

  const brandResultId = result.createBrandResults(brand);

  return Result.find(brandResultId);
});

Meteor.publish('result.products', function(id, page = 0, perPage = 25) {
  const result = Result.findOne(id);
  if (!result) { throw 'Not found'; }
  result.authorize();

  return result.products(page, perPage);
});
