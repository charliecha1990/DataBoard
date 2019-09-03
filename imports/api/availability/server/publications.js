import {Meteor} from "meteor/meteor";
import Availability from "../availability";


Meteor.publish("availability",function(){
  if (!this.userId) {
    return this.ready();
  }
  return Availability.find({});
});