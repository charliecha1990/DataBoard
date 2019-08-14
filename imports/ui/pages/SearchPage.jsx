import React from "react";
import PageBase from "../components/PageBase";
import "react-widgets/dist/css/react-widgets.css";
import Dataset from "../../api/dataSet/DataSet";
import { withStyles } from "@material-ui/styles";
import { SingleSelect } from "react-select-material-ui";
import _ from "lodash";
import RaisedButton from "../components/buttons/RaisedButton";
import { createRows } from "../../util/getDatabaseFields";
import Paper from "@material-ui/core/Paper";
import User from "../../api/users/User";
import EnhancedTable from "../components/Profile/EnhancedTable";
import { generateFields } from "../../util/getDatabaseFields";

const styles = theme => ({
  root: {
    width: "60%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(5)
  },
  clear: {
    marginLeft: theme.spacing(5)
  },
  skillBox: {
    width: "25%",
    margin: theme.spacing(1)
  },
  valueBox: {
    width: "12%",
    margin: theme.spacing(1)
  },
  search: {
    margin: theme.spacing(0.5)
  }

})
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
  }

  performSearch = () => {
    this.setState({ searching: true })
    let searchObject = this.constructSearchObject();
    // console.log(searchObject)
    let res = Dataset.find(searchObject).fetch();
    let rows = createRows(this.getEnteredSkills(this.state.frontendSkill), this.getEnteredSkills(this.state.backendSkill), this.getEnteredSkills(this.state.dataSkill), "left")
    res.forEach(row => {
      // console.log("Every row",row.userId)
      let user = User.findOne({ _id: row.userId })
      row["name"] = user.profile.firstName + " " + user.profile.lastName
    })
    this.setState({ searchResults: res, rows }, () => console.log("State", this.state))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.searching) {
      return true;
    }
    if (nextState.searching && this.state.searchResults !== nextState.searchResults) {
      return true;
    }
    return false;
  }

  constructSearchObject = () => {
    let searchObject = {}
    if (this.state.frontendSkill) {
      searchObject["frontend." + this.state.frontendSkill] = this.state.frontendSkillLevel ? { $gte: Number(this.state.frontendSkillLevel) } : { $gte: 1 }
    }
    if (this.state.backendSkill) {
      searchObject["backend." + this.state.backendSkill] = this.state.backendSkillLevel ? { $gte: Number(this.state.backendSkillLevel) } : { $gte: 1 }
    }
    if (this.state.dataSkill) {
      searchObject["data." + this.state.dataSkill] = this.state.dataSkillLevel ? { $gte: Number(this.state.dataSkillLevel) } : { $gte: 1 }
    }
    return searchObject;
  }
  state = {
    frontendSkill: "",
    frontendSkillLevel: "",
    backendSkill: "",
    backendSkillLevel: "",
    dataSkill: "",
    dataSkillLevel: "",
    searching: false,
    searchResults: [],
    rows: []
  }

  onClear = () => {
    this.setState({
      searching: false
    }, () => console.log("reset", this.state))
  }
  getEnteredSkills = (skill) => {
    let selected = []
    let isEmpty = !skill || 0 === skill.length
    if (!isEmpty) {
      // console.log("Skill",skill)
      selected.push(skill)
      return selected;
    }

  }

  SelectProps = {
    isClearable: true
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.performSearch();
  }
  setFrontendSkill = (value) => {
    this.setState({ frontendSkill: _.lowerCase(value) })
  }

  setFrontEndLevel = (value) => {
    this.setState({ frontendSkillLevel: value });
  }

  setBackendSkill = (value) => {
    this.setState({ backendSkill: _.lowerCase(value) })
  }
  setBackendLevel = (value) => {
    this.setState({ backendSkillLevel: value })
  }
  setDataSkill = (value) => {
    this.setState({ dataSkill: _.lowerCase(value) });
  }
  setDataLevel = (value) => {
    this.setState({ dataSkillLevel: value });
  }
  render() {
    // console.log(this.state);
    let frontendSkills = this.props.frontendSkills.map(skill => _.capitalize(skill));
    let backendSkills = this.props.backendSkills.map(skill => _.capitalize(skill));
    let dataSkills = this.props.dataSkills.map(skill => _.capitalize(skill));
    let skillRange = ["0", "1", "2", "3", "4", "5"];
    const { classes } = this.props;
    return (
      <PageBase {...this.props}>
        <SingleSelect
          className={classes.skillBox}
          SelectProps={this.SelectProps}
          placeholder="Select a Frontend Skill"
          options={frontendSkills}
          onChange={this.setFrontendSkill} />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Select a value"
          options={skillRange}
          onChange={this.setFrontEndLevel} />
        <br /><br />
        <SingleSelect
          className={classes.skillBox}
          placeholder="Select a Backend Skill"
          SelectProps={this.SelectProps}
          options={backendSkills}
          onChange={this.setBackendSkill} />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Select a value"
          options={skillRange}
          onChange={this.setBackendLevel} />
        <br /><br />
        <SingleSelect
          className={classes.skillBox}
          placeholder="Select a Data Skill"
          options={dataSkills}
          SelectProps={this.SelectProps}
          onChange={this.setDataSkill} />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Select a value"
          options={skillRange}
          onChange={this.setDataLevel} />
        <br /><br />
        <RaisedButton className={classes.search} color="secondary" onClick={this.onSubmit}>Search</RaisedButton>
        {
          this.state.searching &&
          <Paper className={classes.root}>
            {(this.state.frontendSkill || this.state.backendSkill || this.state.dataSkill) ?
              <EnhancedTable data={this.state.searchResults} rows={this.state.rows} dataAlign="left" /> :

              <EnhancedTable
                data={this.state.searchResults}
                frontendSkills={generateFields("frontend")}
                backendSkills={generateFields("backend")}
                dataSkills={generateFields("data")}
              />
            }
          </Paper>
        }
        {this.state.searching && <RaisedButton className={classes.clear} color="secondary" onClick={this.onClear} className={classes.clear}>
          Clear
            </RaisedButton>}
      </PageBase>
    );
  }
}

export default withStyles(styles)(SearchPage);