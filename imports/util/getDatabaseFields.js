import DataSet from "../api/dataSet/DataSet";
import _ from "lodash";

let generateFields = (name) => {
  let fields = DataSet.getFields();
  let mapping = fields.filter(element => element["name"] === name)
    .map(element => element["fields"]);
  return Object.keys(mapping[0]);
};

let flattenData = (dataSet, varargs) => {
  dataSet = dataSet || [];
  varargs = varargs || [];
  let flatData = [];
  dataSet.forEach(row => {
    let frontend = row["frontend"] || {};
    let backend = row["backend"] || {};
    let datasci = row["data"] || {};
    let newRow = {};
    newRow["id"] = row["_id"];
    newRow["practitioner"] = row["name"];
    Object.keys(frontend).forEach(s => {
      newRow[s] = frontend[s] || 0;
    });
    Object.keys(backend).forEach(s => {
      newRow[s] = backend[s] || 0;
    });
    Object.keys(datasci).forEach(s => {
      newRow[s] = datasci[s] || 0;
    });
    varargs.forEach(arg => newRow[arg] = row[arg]);
    flatData.push(newRow);
  });
  return flatData;
};
let generateRowFormat = (skillsList, dynamicRows, align) => {
  if (skillsList) {
    skillsList.forEach(skill => {
      dynamicRows.push({
        id: skill,
        numeric: true,
        align: align || "center",
        disablePadding: false,
        label: _.capitalize(skill)
      });
    });
  }
};
let createRows = (frontendSkills, backendSkills, dataSkills, align) => {

  let dynamicRows = [];
  dynamicRows.push({ id: "practitioner", numeric: false, disablePadding: true, label: "Practitioner" });
  generateRowFormat(frontendSkills, dynamicRows, align);
  generateRowFormat(backendSkills, dynamicRows, align);
  generateRowFormat(dataSkills, dynamicRows, align);
  // console.log(dynamicRows);
  return dynamicRows;
};

let mapDataNew = (dataSet, dynamicRows, varargs) => {
  let flatData = flattenData(dataSet, varargs);
  let skills = dynamicRows.map(row => row["id"]);
  let mappedData = [];
  flatData.forEach(item => {
    let newRow = {};
    newRow["practitioner"] = item["practitioner"];
    newRow["id"] = item["id"];
    skills.forEach(skill => {
      newRow[skill] = item[skill];
    });
    mappedData.push(newRow);
  });
  return mappedData;
};

export {
  generateFields,
  flattenData,
  createRows,
  mapDataNew
};
