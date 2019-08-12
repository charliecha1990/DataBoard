import React from "react";
import PageBase from "../components/PageBase";
import "react-widgets/dist/css/react-widgets.css";
import Dataset from "../../api/dataSet/DataSet";
import { withStyles } from "@material-ui/styles";
import { SingleSelect } from "react-select-material-ui";
import _ from "lodash";
import RaisedButton from "../components/buttons/RaisedButton";

const styles = theme => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  frontend: {
    marginLeft: "10px",
    marginRight: "10px"
  },
  frontendLevel: {
    marginLeft: "10px"
  }
})
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedFrontEndSkill: "",
    selectedFrontEndLevel: "",
    selectedBackendSkill: "",
    selectedBackendLevel: "",
    selectedDataSkill: "",
    selectedDataLevel: "",
  }
  onSubmit = (e) => {
    e.preventDefault();
    let dataset = Dataset.find().fetch();
    let fronendRecords = dataset.map(elem => elem["frontend"]).filter(elem => elem[this.state.selectedFrontEndSkill] >= this.state.selectedFrontEndLevel);
    console.log(this.state.selectedFrontEndSkill, this.state.selectedFrontEndLevel)
    console.log(fronendRecords);
  }
  setFrontendSkill = (value) => {
    this.setState({ selectedFrontEndSkill: _.lowerCase(value) })
  }

  setFrontEndLevel = (value) => {
    this.setState({ selectedFrontEndLevel: value });
  }

  setBackendSkill = (value) => {
    this.setState({ selectedBackendSkill: _.lowerCase(value) })
  }
  setBackendLevel = (value) => {
    this.setState({ selectedBackendLevel: value })
  }
  setDataSkill = (value) => {
    this.setState({ selectedDataSkill: _.lowerCase(value) });
  }
  setDataLevel = (value) => {
    this.setState({ selectedDataSkill: value });
  }
  render() {
    let frontendSkills = this.props.frontendSkills.map(skill => _.capitalize(skill));
    let backendSkills = this.props.backendSkills.map(skill => _.capitalize(skill));
    let dataSkills = this.props.dataSkills.map(skill => _.capitalize(skill));
    let skillRange = ["0", "1", "2", "3", "4", "5"];
    const { classes } = this.props;
    return (
      <PageBase {...this.props} className={classes.root}>
        <SingleSelect
          className={classes.frontend}
          style={{ width: "35%" }}
          placeholder="Select a Frontend Skill"
          options={frontendSkills}
          onChange={this.setFrontendSkill} />
        <SingleSelect
          className={classes.frontendLevel}
          style={{ width: "15%" }}
          placeholder="Select a value"
          options={skillRange}
          onChange={this.setFrontEndLevel} />
        <br /><br />
        <SingleSelect
          className={classes.frontend}
          style={{ width: "35%" }}
          placeholder="Select a Backend Skill"
          options={backendSkills}
          onChange={this.setBackendSkill} />
        <SingleSelect
          className={classes.frontendLevel}
          style={{ width: "15%" }}
          value="Hello"
          placeholder="Select a value"
          options={skillRange}
          onChange={this.setBackendLevel} />
        <br /><br />
        <SingleSelect
          className={classes.frontend}
          style={{ width: "35%" }}
          placeholder="Select a Data Skill"
          options={dataSkills}
          onChange={this.setBackendSkill} />
        <SingleSelect
          className={classes.frontendLevel}
          style={{ width: "15%" }}
          value="Hello"
          placeholder="Select a value"
          options={skillRange}
          onChange={this.setBackendLevel} />
        <br /><br />
        <RaisedButton color="secondary" onClick={this.onSubmit}>Search</RaisedButton>
      </PageBase>
    );
  }
}

export default withStyles(styles)(SearchPage);