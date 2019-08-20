// Random data insert
import Dataset from "../../api/dataSet/DataSet";
import User from "../../api/users/User";
import Availability from "../../api/availability/availability";

const dg = require("random-date-generator");

// Accounts.removeDefaultRateLimit();

function getRandom(max, min) {
  return Math.floor(Math.random() * Math.floor(max - min) + min);
}

function getSkills(skills, length, maxTimes, minTimes) {
  let selected = [];
  while (selected.length < length) {
    let num = getRandom(maxTimes - 1, minTimes);
    let skill = skills[num];
    if (!selected.includes(skill)) {
      selected.push(skill);
    }
  }
  return selected;
}

function fillSkills(skillList, skillObject) {
  for (let i = 0; i < skillList.length; i++) {
    skillObject[skillList[i]] = getRandom(5, 1);
  }
  // console.log("Skills", skillObject)
  return skillObject;
}

function populateDatabase() {
  let done = new Set();
  let firstNames = ["Jack", "Jane", "Xavier", "Super", "Bob", "Andy"];
  let lastNames = ["Doe", "Murray", "User", "Winters", "Dillon"];
  let frontend = ["react", "angular", "html", "javascript", "vue"];
  let backend = ["java", "python", "node", "chsharp", "cpp"];
  let data = ["sql", "r", "pandas", "numpy", "sklearn", "spark"];

  for (; done.size < 10;) {
    let firstName = getSkills(firstNames, 1, firstNames.length, 0)[0];
    let lastname = getSkills(lastNames, 1, lastNames.length, 0)[0];
    let email = firstName + "." + lastname + "@example.com";
    if (done.has(email)) continue;
    let id = Accounts.createUser({
      email: email,
      password: "123456",
      profile: {
        firstName,
        lastName: lastname
      }
    });
    done.add(firstName + "." + lastname + "@example.com");
    let frontSkills = getSkills(frontend, 2, frontend.length, 0);
    let backSkills = getSkills(backend, 2, backend.length, 0);
    let dSkills = getSkills(data, 2, data.length, 0);
    let params = {};
    params["userId"] = id.toString();
    let ftend = fillSkills(frontSkills, {});
    frontend.forEach(skill => {
      if (!Object.keys(ftend).includes(skill)) {
        ftend[skill] = 0;
      }
    });
    // console.log(ftend);
    params["frontend"] = ftend;
    let bkend = fillSkills(backSkills, {});
    backend.forEach(skill => {
      if (!Object.keys(bkend).includes(skill)) {
        bkend[skill] = 0;
      }
    });
    params["backend"] = bkend;
    let dt = fillSkills(dSkills, {});
    data.forEach(skill => {
      if (!Object.keys(dt).includes(skill)) {
        dt[skill] = 0;
      }
    });
    params["data"] = dt;
    params["isApproved"] = false;
    // console.log("params",params);
    const dataSet = new Dataset({
      userId: id,
      frontend: ftend,
      backend: bkend,
      data: dt,
      isApproved: false,
      name: params["name"]
    });
    dataSet.save();
  }
}

function randomDate(start, end, n) {
  start = new Date(2018, 0, 1);
  end = new Date(2018, 11, 31);
  let startList = [];
  let endList = [];
  let begin = "";
  let finish = "";
  let count = 0;
  while (startList.length < n) {
    if (count > 2) {
      start = new Date(2019, 0, 1);
      end = new Date(2020, 11, 31);
    }
    while (true) {
      begin = dg.getRandomDateInRange(start, end);
      if (begin > start) {
        startList.push(begin);
        break;
      }
    }

    while (true) {
      finish = dg.getRandomDateInRange(begin, end);
      if (finish > begin) {
        endList.push(finish);
        break;
      }
    }
    // console.log("Begin",begin,"Finish",finish);
    start = finish;
    count++;
  }

  return {
    startList,
    endList
  };
}

function populateAvailabities() {
  let availabilities = [];
  for (let i = 0; i < 10; i++) {
    let res = randomDate(new Date(2018, 0, 1), new Date(2020, 11, 31), 5);
    res["name"] = Math.random()
      .toString(36)
      .substring(7);
    availabilities.push(res);
  }
  return availabilities;
}

populateDatabase();

let availabilities = populateAvailabities();
let users = User.find().fetch();
let index = 0;
users.forEach(user => {
  let email = user.emails[0]["address"];
  let current = availabilities[index];
  index++;
  for (let j = 0; j < current["startList"].length; j++) {
    let startList = current["startList"];
    let endList = current["endList"];
    const availability = new Availability({
      email: email,
      startDate: startList[j],
      endDate: endList[j]
    });
    availability.save();
  }
});

let records = Availability.find().fetch();
records.forEach(record => {
  let user = User.findOne({
    emails: { $elemMatch: { address: record.email } }
  });

  let dataset = Dataset.findOne({ userId: user._id });
  // console.log(dataset["frontend"]["react"])
  let avl = dataset["availability"];
  if (avl) {
    avl.push(record._id);
  } else {
    avl = [record._id];
  }
  // // console.log("Avl",avl);
  dataset.set({
    availability: avl
  });
  dataset.save();
  // console.log("avl for user", user.email(), dataset["availability"]);
});


Availability.find().fetch()
  .forEach(record => {
    let currentStart = record["startDate"];
    let currentEnd = record["endDate"];
    record.set({ "startDate": new Date(currentStart.toDateString()) });
    record.set({"endDate": new Date(currentEnd.toDateString())});
    record.save();
  });