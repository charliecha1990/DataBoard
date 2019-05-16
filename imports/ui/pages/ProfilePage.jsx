import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import Dialog from "../components/Profile/Dialog";
import PageBase from "../components/PageBase";
import PersonalTable from "../components/Profile/PersonalTable";

import callWithPromise from '/imports/util/callWithPromise';
import DataSet from '/imports/api/dataSet/DataSet';


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

    const para = {
      name: this.state.name,
      frontEndLevel:this.state.frontEndLevel,
      backEndLevel: this.state.backEndLevel,
      dataLevel: this.state.dataLevel,
      isApproved: true
    }

    console.log(this.state, this.props.dataSet)

    callWithPromise('dataSet.create',para)
      .then(id => console.log(id))
      .then(() => {})
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { dataSets, dataSet, loading, classes, match, ...props } = this.props;
    const { name, frontEndLevel, backEndLevel, dataLevel, open } = this.state;
    // const dataSet = DataSet.find({ userId: Meteor.userId() }).fetch(),

    // if(loading) {
    //   { return <PageBase loading /> }
    // }
    console.log(loading,dataSet, dataSets)

    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon />}
        onAction={() => {
          this.setState({ open: true });
        }}
      >
        <PersonalTable 
         dataSet={dataSet}
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
