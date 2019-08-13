// Random data insert
import callWithPromise from "../../util/callWithPromise";
import Dataset from "../../api/dataSet/DataSet";
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
let done = new Set();
let randomData = [];
let firstNames = ["Jack", "Jane", "Xavier", "Super", "Bob", "Andy"];
let lastNames = ["Doe", "Murray", "User", "Winters", "Dillon"];
let frontend = ["react", "angular", "html", "javascript", "vue"];
let backend = ["java", "python", "node", "chsharp", "cpp"];
let data = ["sql", "r", "pandas", "numpy", "sklearn", "spark"];

function fillSkills(skillList, skillObject) {
    for (let i = 0; i < skillList.length; i++) {
        skillObject[skillList[i]] = getRandom(5, 1);
    }
    // console.log("Skills", skillObject)
    return skillObject;
}

for (; done.size < 10;) {
    let firstName = getSkills(firstNames, 1, firstNames.length,1)[0];
    let lastname = getSkills(lastNames, 1, lastNames.length,1)[0];
    let email = firstName + "." + lastname + "@example.com"
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
    let frontSkills = getSkills(frontend, 2, frontend.length,1);
    let backSkills = getSkills(backend, 2, backend.length,1);
    let dSkills = getSkills(data, 2, data.length,1);
    let params = {};
    params["userId"] = id.toString();
    let ftend = fillSkills(frontSkills, {})
    frontend.forEach(skill => {
        if(!Object.keys(ftend).includes(skill)){
            ftend[skill] =0;
        }
    })
    console.log(ftend);
    params["frontend"] = ftend;
    let bkend = fillSkills(backSkills, {})
    backend.forEach(skill => {
        if(!Object.keys(bkend).includes(skill)){
            bkend[skill] =0;
        }
    })
    params["backend"] = bkend;
    let dt = fillSkills(dSkills, {})
    data.forEach(skill => {
        if(!Object.keys(dt).includes(skill)){
            dt[skill] =0 ;
        }
    })
    params["data"] = dt;
    params["isApproved"] = false;
    // console.log("params",params);
    const dataSet = new Dataset({
        userId: id,
        frontend: ftend,
        backend: bkend,
        data: dt,
        isApproved: false
    });
    dataSet.save();
    // console.log("Saved", params);
    // callWithPromise("dataSet.create", params).then(() => console.log("Promise callback")).catch(err => { throw err });
    // setTimeout(() => {

    // }, 10000);
}