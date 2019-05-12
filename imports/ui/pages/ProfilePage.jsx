import React from "react";
import { withRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import Dialog from "../components/Profile/Dialog";
import PageBase from "../components/PageBase";
import PersonalTable from "../components/Profile/PersonalTable";

const styles = _theme => ({});

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      practitionerData: {
        frontEndLevel: '',
        backEndLevel: '',
        dataLevel: '',
        name: ''
      }
    };
  }

  handleChange = name => event => {
    this.setState({ 
      practitionerData: {
        [name]: Number(event.target.value)
      }
    });
  };

  handleNameChange = event => {
    this.setState({
      practitionerData: {
        name: event.target.value
      }
    });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { dataSets, loading, classes, match, ...props } = this.props;
    const { practitionerData, open } = this.state;

    console.log(dataSets,this.state.practitionerData);

    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon />}
        onAction={() => {
          this.setState({ open: true });
        }}
      >
        <PersonalTable practitionerData={practitionerData} />
        <Dialog
          practitionerData={practitionerData}
          open={open}
          onClose={this.handleClose}
          onChange={this.handleChange}
          onNameChange={this.handleNameChange}
          onSubmit={this.handleSubmit}
        />
      </PageBase>
    );
  }
}

export default compose(withRouter, withStyles(styles))(ProfilePage);
