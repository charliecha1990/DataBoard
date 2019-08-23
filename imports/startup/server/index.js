import './accounts';
import './register-api';
import './migrate';
import User from "../../api/users/User";
import Availability from "../../api/availability/availability";
// import "./insertRandomData";
let fs = require("fs");

// let users = User.find().fetch();
// users.map(user => {
//   // console.log(user.profile.firstName, user.profile.lastName, user.email());
//   let allRecords = Availability.find({ email: user.email() }).fetch();
//   // allRecords.sort((a, b) => a.endDate > b.endDate ? 1 : -1);
//   fs.appendFileSync("C:\\Users\\sneglur\\DataBoard\\output.txt", user.email() + "\n" + "------------" + "\n");
//   allRecords.forEach(r => fs.appendFileSync("C:\\Users\\sneglur\\DataBoard\\output.txt",
//     r.startDate.toDateString() + " to " + r.endDate.toDateString() + "\n"));
//   fs.appendFileSync("C:\\Users\\sneglur\\DataBoard\\output.txt","\n");
// });
// fs.appendFileSync("C:\\Users\\sneglur\\DataBoard\\output.txt", "---------------------" + "\n");


Accounts.removeDefaultRateLimit();