import React, { Component } from "react";
import DataSet from "../../api/dataSet/DataSet";
import { createRows, generateFields } from "../../util/getDatabaseFields";
import _ from "loadsh";
import PageBase from "../components/PageBase";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { SingleSelect } from "react-select-material-ui";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import RaisedButton from "../components/buttons/RaisedButton";
import Paper from "@material-ui/core/Paper";
import EnhancedTable from "../components/Profile/EnhancedTable";
import Availability from "../../api/availability/availability";
import User from "../../api/users/User";
import SnackbarComponent from "../components/SnackbarComponent";

const styles = theme => ({
  root: {
    width: "65%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(5)
  },

  dates: {
    width: "12%",
    margin: theme.spacing(1)
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
});

class SearchPage extends Component {
  constructor(props) {
    super(props);
    let date = new Date();
    const today =
      date.getFullYear() +
      "-" +
      (date.getMonth() < 10 ? "0" : "") +
      (date.getMonth() + 1) +
      "-" +
      date.getDate();
    this.state = {
      firstSkill: "",
      firstSkillLevel: "",
      secondSkill: "",
      secondSkillLevel: "",
      thirdSkill: "",
      thirdSkillLevel: "",
      frontendSkills: new Set(),
      backendSkills: new Set(),
      dataSkills: new Set(),
      startDate: today,
      endDate: today,
      hasError: false,
      searchResults: [],
      rows: [],
      searching: false,
      snackbarOpen: false
    };
  }

  /*
  Lifecycle methods
   */
  componentDidMount() {
    this.setState({
      frontendSkills: new Set(this.props.frontendSkills),
      backendSkills: new Set(this.props.backendSkills),
      dataSkills: new Set(this.props.dataSkills)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !nextState.searching ||
      this.state.searching !== nextState.searching ||
      this.state.searchResults !== nextState.searchResults ||
      this.state.hasError !== nextState.hasError
    );
  }

  /*
  Page Functionality
   */
  getSkillType = skill => {
    if (this.state.frontendSkills.has(skill)) {
      return "frontend";
    } else if (this.state.backendSkills.has(skill)) {
      return "backend";
    } else if (this.state.dataSkills.has(skill)) {
      return "data";
    }
    return "";
  };
  constructSearchObject = () => {
    let searchObject = {};
    if (this.state.firstSkill) {
      let skillType = this.getSkillType(this.state.firstSkill);
      if (!searchObject[skillType + "." + this.state.firstSkill]) {
        searchObject[skillType + "." + this.state.firstSkill] = this.state
          .firstSkillLevel
          ? { $gte: Number(this.state.firstSkillLevel) }
          : { $gte: 1 };
      }
    }
    if (this.state.secondSkill) {
      let skillType = this.getSkillType(this.state.secondSkill);
      if (!searchObject[skillType + "." + this.state.secondSkill]) {
        searchObject[skillType + "." + this.state.secondSkill] = this.state
          .secondSkillLevel
          ? { $gte: Number(this.state.secondSkillLevel) }
          : { $gte: 1 };
      }
    }
    if (this.state.thirdSkill) {
      let skillType = this.getSkillType(this.state.thirdSkill);
      if (!searchObject[skillType + "." + this.state.thirdSkill]) {
        searchObject[skillType + "." + this.state.thirdSkill] = this.state
          .thirdSkillLevel
          ? { $gte: Number(this.state.thirdSkillLevel) }
          : { $gte: 1 };
      }
    }
    return searchObject;
  };

  /*
  Utilities
   */

  getEnteredSkills = skill => {
    let selected = [];
    let isEmpty = !skill || 0 === skill.length;
    if (!isEmpty) {
      selected.push(skill);
      return selected;
    }
  };

  /*
  Search function
  */
  performSearch = () => {
    this.setState({ searching: true });
    if (
      this.state.firstSkill ||
      this.state.secondSkill ||
      this.state.thirdSkill
    ) {
      let searchObject = this.constructSearchObject();
      let res = DataSet.find(searchObject).fetch();
      let rows = createRows(
        this.getEnteredSkills(this.state.firstSkill),
        this.getEnteredSkills(this.state.secondSkill),
        this.getEnteredSkills(this.state.thirdSkill),
        "left"
      );
      rows.push({
        id: "startDate",
        label: "Start Date",
        disablePadding: false,
        align: "left",
        numeric: false
      });
      rows.push({
        id: "endDate",
        label: "End Date",
        disablePadding: false,
        align: "left",
        numeric: false
      });
      res = res.filter(row => {
        let availabilities = row["availability"];
        availabilities = availabilities.map(e =>
          Availability.findOne({ _id: e })
        );
        availabilities.sort((a, b) => (a.endDate > b.endDate ? 1 : -1));
        for (let i = 0; i < availabilities.length - 1; i++) {
          let stateStartDate = new Date(this.state.startDate);
          let stateEndDate = new Date(this.state.endDate);
          if (
            availabilities[i].endDate <= stateStartDate &&
            availabilities[i + 1].startDate >= stateEndDate
          ) {
            let actualStartDate = availabilities[i].endDate;
            actualStartDate.setDate(actualStartDate.getDate() + 1);
            let actualEndDate = availabilities[i + 1].startDate;
            actualEndDate.setDate(actualEndDate.getDate() - 1);
            row["startDate"] = actualStartDate.toDateString();
            row["endDate"] = actualEndDate.toDateString();
            return true;
          }
        }
        return false;
      });
      res.forEach(row => {
        let user = User.findOne({ _id: row.userId });
        row["name"] = user.profile.firstName + " " + user.profile.lastName;
      });
      this.setState({
        searchResults: res,
        rows,
        hasError: false
      });
    } else {
      this.setState({ hasError: true });
    }
  };
  SelectProps = {
    isClearable: true
  };

  onClear = () => {
    this.setState({ hasError: false, searching: false });
  };
  onSubmit = e => {
    e.preventDefault();
    this.performSearch();
  };

  handleDate = (field, value) => {
    this.setState({ [field]: value });
  };

  handleChange = (field, value) => {
    this.setState({ [field]: _.lowerCase(value) });
  };

  render() {
    let skills = this.props.skills.map(skill => _.capitalize(skill));
    let skillRange = this.props.skillRange;
    const { classes } = this.props;
    return (
      <PageBase {...this.props}>
        {/*
        First Skill Entry
         */}
        <SingleSelect
          className={classes.skillBox}
          SelectProps={this.SelectProps}
          placeholder="Skill"
          options={skills}
          onChange={skill => this.handleChange("firstSkill", skill)}
        />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Value"
          options={skillRange}
          onChange={value => this.handleChange("firstSkillLevel", value)}
        />
        <br />
        <br />
        {/*
        Second Skill Entry
         */}
        <SingleSelect
          className={classes.skillBox}
          placeholder="Skill"
          SelectProps={this.SelectProps}
          options={skills}
          onChange={skill => this.handleChange("secondSkill", skill)}
        />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Value"
          options={skillRange}
          onChange={value => this.handleChange("secondSkillLevel", value)}
        />
        <br />
        <br />
        {/*
          Third Skill Entry
           */}
        <SingleSelect
          className={classes.skillBox}
          placeholder="Skill"
          options={skills}
          SelectProps={this.SelectProps}
          onChange={skill => this.handleChange("thirdSkill", skill)}
        />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Value"
          options={skillRange}
          onChange={value => this.handleChange("thirdSkillLevel", value)}
        />
        <br />
        <br />
        {/*
          Start Date
           */}
        <MuiThemeProvider theme={createMuiTheme({})}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.dates}
              onChange={date => this.handleDate("startDate", date)}
              variant="dialog"
              value={this.state.startDate}
              format="MM/dd/yyyy"
            />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
        <MuiThemeProvider theme={createMuiTheme({})}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.dates}
              onChange={date => this.handleDate("endDate", date)}
              variant="dialog"
              value={this.state.endDate}
              format="MM/dd/yyyy"
            />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
        <br /> <br />
        <RaisedButton
          className={classes.search}
          color="secondary"
          onClick={this.onSubmit}
        >
          Search
        </RaisedButton>
        <Paper className={classes.root}>
          {this.state.searching && !this.state.hasError && (
            <EnhancedTable
              data={this.state.searchResults}
              rows={this.state.rows}
              dataAlign="left"
              optional={["startDate", "endDate"]}
            />
          )}
          {this.state.searching && this.state.hasError && (
            <SnackbarComponent
              message={"Please enter at least 1 skill"}
              open={true}
            />
          )}
        </Paper>
        {this.state.searching && !this.state.hasError && (
          <RaisedButton
            className={classes.clear}
            color="secondary"
            onClick={this.onClear}
          >
            Clear
          </RaisedButton>
        )}
      </PageBase>
    );
  }
}


export default withStyles(styles)(SearchPage);
