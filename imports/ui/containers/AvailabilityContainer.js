import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import AvailabilityPage from "../pages/Availability/AvailabilityPage";
import Availability from "../../api/availability/availability";
import User from "../../api/users/User";
import { createRows } from "../../util/getDatabaseFields";

let getFirstIndex = (records, referenceDate) => {
  referenceDate = new Date(referenceDate);
  let index = -1;
  for (let i = 0; i < records.length; i++) {
    if (records[i].endDate >= referenceDate) {
      index = i;
      break;
    }
  }
  return index;
};

let formatDate = (date) => {
  return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
};
export default compose(
  withRouter,
  withTracker(() => {
    const availabilityHandle = Meteor.subscribe("availability");
    Meteor.subscribe("users");
    let rows = createRows([], [], []);
    rows.push({ id: "availability", label: "Availability", numeric: "false", disablePadding: true, align: "left" });
    let users = User.find().fetch();
    let data = [];
    users.forEach(user => {
      let records = Availability.find({ email: user.email() }).fetch();
      records.sort((a, b) => a.endDate > b.endDate ? 1 : -1);
      let finalString = "";
      let finalList = [];
      let index = getFirstIndex(records, new Date(new Date().toDateString()));
      if (index !== -1) {
        for (let i = index; i < records.length; i++) {
          let actualStartDate = records[i - 1].endDate || new Date(new Date().toDateString());
          actualStartDate.setDate(actualStartDate.getDate() + 1);
          let actualEndDate = records[i].startDate;
          actualEndDate.setDate(actualEndDate.getDate() - 1);
          finalList.push(actualStartDate.toDateString()+" - "+actualEndDate.toDateString());
          if (i !== records.length - 1) {
            finalString += " , ";
          }
        }
      }
      data.push({
        _id: user._id,
        practitioner: user.profile.firstName + " " + user.profile.lastName,
        availability: finalList
      });
    });

    return {
      loading: !availabilityHandle.ready(),
      data,
      rows
    };
  }),
  withMessageContext)(AvailabilityPage);