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
import TextField from "@material-ui/core/TextField";
import Availability from "../../api/availability/availability";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputLabel } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  root: {
    width: "65%",
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
});

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    let date = new Date();
    const today = date.getFullYear() + "-" +
      (date.getMonth() < 10 ? "0" : "") +
      (date.getMonth() + 1) + "-" + date.getDate();
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
      searching: false,
      searchResults: [],
      rows: []
    };

  }

  componentDidMount() {
    this.setState({
      frontendSkills: new Set(this.props.frontendSkills),
      backendSkills: new Set(this.props.backendSkills),
      dataSkills: new Set(this.props.dataSkills)
    });
  }

  performSearch = () => {
    this.setState({ searching: true });
    let searchObject = this.constructSearchObject();
    // console.log(searchObject);
    let res = Dataset.find(searchObject).fetch();
    let rows = createRows(
      this.getEnteredSkills(this.state.firstSkill),
      this.getEnteredSkills(this.state.secondSkill),
      this.getEnteredSkills(this.state.thirdSkill),
      "left"
    );
    rows.push({ id: "startDate", label: "Start Date", disablePadding: false, align: "left", numeric: false });
    rows.push({ id: "endDate", label: "End Date", disablePadding: false, align: "left", numeric: false });
    // console.log("res before",res);
    res = res.filter(row => {
      let availabilities = row["availability"];
      availabilities = availabilities.map(e => Availability.findOne({ _id: e }));
      for (let i = 0; i < availabilities.length - 1; i++) {
        let stateStartDate = new Date(this.state.startDate);
        let stateEndDate = new Date(this.state.endDate);
        if (availabilities[i].endDate <= stateStartDate
          && availabilities[i + 1].startDate >= stateEndDate) {
          let actualStartDate = availabilities[i].endDate;
          actualStartDate.setDate(actualStartDate.getDate()+1);
          let actualEndDate = availabilities[i+1].startDate;
          actualEndDate.setDate(actualEndDate.getDate()-1);
          row["startDate"] = actualStartDate.toDateString();
          row["endDate"] = actualEndDate.toDateString();
          return true;
        }
      }
      return false;
    });
    // console.log("res after",res);
    res.forEach(row => {
      // console.log("Every row",row.userId)
      let user = User.findOne({ _id: row.userId });
      row["name"] = user.profile.firstName + " " + user.profile.lastName;
    });
    console.log(this.state.startDate,this.state.endDate);
    console.log(res);
    this.setState({ searchResults: res, rows });
    // this.searchQuery(this.state,this.getSkillType);

  };

  searchQuery = (state, getSkillType) => {
    let query = {
      $where: function() {
        let firstSkillType = getSkillType(state.firstSkill);
        let firstSkillLevel = state.firstSkillLevel ? Number(state.firstSkillLevel) : 1;
        let secondSkillType = getSkillType(state.secondSkill);
        let secondSkillLevel = state.secondSkillLevel ? Number(state.secondSkillLevel) : 1;
        let thirdSkillType = getSkillType(state.thirdSkill);
        let thirdSkillLevel = state.thirdSkillLevel ? Number(state.thirdSkillLevel) : 1;
        let availabilities = this.availability;
        let available = false;
        availabilities = availabilities.map(e => Availability.findOne({ _id: e }));
        for (let i = 0; i < availabilities.length - 1; i++) {
          if (availabilities[i].endDate <= new Date(state.startDate) && availabilities[i + 1].startDate >= new Date(state.endDate)) {
            available = true;
            break;
          }
        }

        return (this[firstSkillType] ? this[firstSkillType][state.firstSkill] >= firstSkillLevel : true)
          && (this[secondSkillType] ? this[secondSkillType][state.secondSkill] >= secondSkillLevel : true)
          && (this[thirdSkillType] ? this[thirdSkillType][state.thirdSkill] >= thirdSkillLevel : true)
          && available;
      }
    };
    console.log(Dataset.find(query).fetch());
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.searching) {
      return true;
    }
    return (
      nextState.searching &&
      this.state.searchResults !== nextState.searchResults
    );
  }

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

  onClear = () => {
    this.setState(
      {
        searching: false
      },
      () => console.log("reset", this.state)
    );
  };
  getEnteredSkills = skill => {
    let selected = [];
    let isEmpty = !skill || 0 === skill.length;
    if (!isEmpty) {
      // console.log("Skill",skill)
      selected.push(skill);
      return selected;
    }
  };

  SelectProps = {
    isClearable: true
  };
  onSubmit = e => {
    e.preventDefault();
    this.performSearch();
    // this.searchQuery(this.state, this.getSkillType);
  };
  setFirstSkill = value => {
    console.log(value);
    this.setState({ firstSkill: _.lowerCase(value) });
  };

  setFirstSkillLevel = value => {
    this.setState({ firstSkillLevel: value });
  };

  setSecondSkill = value => {
    this.setState({ secondSkill: _.lowerCase(value) });
  };
  setSecondSkillLevel = value => {
    this.setState({ secondSkillLevel: value });
  };
  setThirdSkill = value => {
    this.setState({ thirdSkill: _.lowerCase(value) });
  };
  setThirdSkillLevel = value => {
    this.setState({ thirdSkillLevel: value });
  };
  setDate = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  customChange = (e) => {
    this.setState({[e.target.name]: _.lowerCase(e.target.value)},
      () => console.log(this.state));
  };
  render() {
    // console.log(this.state);
    let skills = this.props.skills.map(skill => _.capitalize(skill));
    let skillRange = this.props.skillRange;
    const { classes } = this.props;
    let date = new Date();
    const today = date.getFullYear() + "-" + (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1) + "-" + date.getDate();
    // console.log("Today", today, date);
    return (
      <PageBase {...this.props}>
        <SingleSelect
          className={classes.skillBox}
          SelectProps={this.SelectProps}
          placeholder="Skill"
          options={skills}
          onChange={this.setFirstSkill}
        />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Value"
          options={skillRange}
          onChange={this.setFirstSkillLevel}
        />
        <br/>
        <br/>
        <SingleSelect
          className={classes.skillBox}
          placeholder="Skill"
          SelectProps={this.SelectProps}
          options={skills}
          onChange={this.setSecondSkill}
        />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Value"
          options={skillRange}
          onChange={this.setSecondSkillLevel}
        />
        <br/>
        <br/>
        <SingleSelect
          className={classes.skillBox}
          placeholder="Skill"
          options={skills}
          SelectProps={this.SelectProps}
          onChange={this.setThirdSkill}
        />
        <SingleSelect
          className={classes.valueBox}
          SelectProps={this.SelectProps}
          placeholder="Value"
          options={skillRange}
          onChange={this.setThirdSkillLevel}
        />
        <br/>
        <br/>
        <TextField
          className="startDate"
          type="date"
          id="startDate"
          defaultValue={today}
          onChange={this.setDate}
        /> &nbsp; &nbsp;
        <TextField
          className="endDate"
          type="date"
          id="endDate"
          defaultValue={today}
          onChange={this.setDate}
        />
        <br/> <br/>
        <RaisedButton
          className={classes.search}
          color="secondary"
          onClick={this.onSubmit}
        >
          Search
        </RaisedButton>
        {this.state.searching && (
          <Paper className={classes.root}>
            {this.state.firstSkill ||
            this.state.secondSkill ||
            this.state.thirdSkill ? (
              <EnhancedTable
                data={this.state.searchResults}
                rows={this.state.rows}
                dataAlign="left"
                optional={["startDate","endDate"]}
              />
            ) : (
              <EnhancedTable
                data={this.state.searchResults}
                frontendSkills={generateFields("frontend")}
                backendSkills={generateFields("backend")}
                dataSkills={generateFields("data")}
              />
            )}
          </Paper>
        )}
        {this.state.searching && (
          <RaisedButton
            className={classes.clear}
            color="secondary"
            onClick={this.onClear}
            className={classes.clear}
          >
            Clear
          </RaisedButton>
        )}
      </PageBase>
    );
  }
}

export default withStyles(styles)(SearchPage);
