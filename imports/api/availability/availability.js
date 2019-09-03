import { Class } from "meteor/jagi:astronomy";

export const Availabilities = new Mongo.Collection("availability");

const Availability = Class.create({
  name: "Availability",
  collection: Availabilities,
  fields: {
    email: {
      type: String,
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    }
  }
});

export default Availability;