import Images from '../Images';

Images.denyClient();

Meteor.publish('files.images', function () {
  return Images.find({ userId: this.userId }).cursor;
});
