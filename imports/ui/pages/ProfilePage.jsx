import React from "react";
import { withRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import Dialog from "../components/Profile/Dialog";
import PageBase from "../components/PageBase";
import PersonalTable from "../components/Profile/PersonalTable";

import callWithPromise from '/imports/util/callWithPromise';

const styles = _theme => ({});

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      frontEndLevel: '',
      backEndLevel: '',
      dataLevel: '',
      name: ''
    };
  }

  handleChange = attribute => event => {
    this.setState({ 
        [attribute]: event.target.value
    });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    
  };

  handleClose = () => {
    this.setState({ open: false });

    console.log(this.state)

    callWithPromise('dataSet.create',{
      name: this.state.name,
      frontEndLevel:this.state.frontEndLevel,
      backEndLevel: this.state.backEndLevel,
      dataLevel: this.state.dataLevel,
      isApproved: true
    })
      .then(id => console.log(id))
      .then(() => {})
  };

  render() {
    const { dataSets, loading, classes, match, ...props } = this.props;
    const { name, frontEndLevel, backEndLevel, dataLevel, open } = this.state;

    console.log(dataSets,this.state);

    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon />}
        onAction={() => {
          this.setState({ open: true });
        }}
      >
        <PersonalTable 
         name={name}
         frontEndLevel={frontEndLevel}
         backEndLevel={backEndLevel}
         dataLevel={dataLevel}
         />
        <Dialog
          name={name}
          frontEndLevel={frontEndLevel}
          backEndLevel={backEndLevel}
          dataLevel={dataLevel}
          open={open}
          onClose={this.handleClose}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </PageBase>
    );
  }
}

export default compose(withRouter, withStyles(styles))(ProfilePage);
