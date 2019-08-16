import React, { Component } from "react";
import PageBase from "../components/PageBase";
import { createRows, mapDataNew, generateFields } from "../../util/getDatabaseFields";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import callWithPromise from "../../util/callWithPromise";
import { Meteor } from "meteor/meteor";


let createEmptyObject = (frontendSkills, backendSkills, dataSkills) => {
  let user = Meteor.user();
  let emptyObject = {};
  emptyObject["id"] = Meteor.userId();
  frontendSkills.forEach(skill => emptyObject[skill] = 0);
  backendSkills.forEach(skill => emptyObject[skill] = 0);
  dataSkills.forEach(skill => emptyObject[skill] = 0);
  emptyObject["isApproved"] = false;
  emptyObject["practitioner"] = user.profile.firstName + " " + user.profile.lastName;
  // emptyObject["practitioner"] = 'Charlie' + " " + 'Zha';

  return emptyObject;
};

class ProfilePage extends Component {
  state = {
    columns: [],
    data: []
  };
  columns = [];
  dynamicRows = [];

  componentDidMount() {
    this.dynamicRows = createRows(this.props.frontendSkills, this.props.backendSkills, this.props.dataSkills);
    this.dynamicRows.forEach(row => {
      let update = "onUpdate";
      if (row["id"] === "practitioner") {
        update = "never";
      }
      this.columns.push({ title: row["id"], field: row["id"], editable: update });
    });
    this.setState({ columns: this.columns });

    // console.log(this.props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.dataSet !== this.props.dataSet) {
      let updatedData = [];
      if(this.props.found){
        updatedData = mapDataNew([this.props.dataSet], this.dynamicRows);
        updatedData.forEach(row => {
          delete row.id;
        });
      }
      else{
        updatedData = [createEmptyObject(this.props.frontendSkills, this.props.backendSkills, this.props.dataSkills)];
      }
      // console.log(this.props.dataSet[0]);
      this.setState({ data: updatedData });
    }
  }

  render() {
    const { dataSets, dataSet, loading, classes,match, frontendSkills, backendSkills, dataSkills, ...props } = this.props;
    let {found} = this.props;
    // console.log(dataToShow);
    return (
      <PageBase
        {...props}
      >
        <Grid container justify="center">
          <Grid item xs={12}>
            <MaterialTable
              title="Your Skills"
              columns={this.columns}
              data={this.state.data}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data;
                        const index = data.indexOf(oldData);
                        data[index] = newData;
                        this.setState({ data }, () => {
                          let params = {};
                          params["userId"] = Meteor.userId();
                          params["name"] = this.state.data[0]["practitioner"];
                          let frontend = {}, backend = {}, data = {};
                          frontendSkills.forEach(skill => {
                            frontend[skill] = Number(this.state.data[0][skill]);
                          });
                          params["frontend"] = frontend;
                          backendSkills.forEach(skill => {
                            backend[skill] = Number(this.state.data[0][skill]);
                          });
                          params["backend"] = backend;
                          dataSkills.forEach(skill => {
                            data[skill] =  Number(this.state.data[0][skill]);
                          });
                          params["data"] = data;
                          params["isApproved"] = false;
                          console.log("found",this.props.found);
                          if(found){
                            callWithPromise("dataSet.update", params).then(() => resolve());
                          }
                          else{
                            callWithPromise("dataSet.create",params).then(() => {
                              found=true;
                              resolve()
                            });
                          }
                          // resolve();
                        });
                      }
                      resolve();
                    }, 125);
                  })
              }}
            />
          </Grid>
        </Grid>
      </PageBase>
    );
  }
}

export default ProfilePage;