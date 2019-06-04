import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';

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
/*
------------------------------------------------------------------------------------------
isEmpty(DataSet)?
Yes:   callWithPromise('dataSet.create',para)
No:    callWithPromise('dataSet.update',para)
For  Satark
*/
  handleSubmit = () => {
    this.setState({ open: false });

    const para = {
      name: this.state.name,
      frontEndLevel:this.state.frontEndLevel,
      backEndLevel: this.state.backEndLevel,
      dataLevel: this.state.dataLevel,
      isApproved: false
    }

    callWithPromise('dataSet.create',para)
      .then(id => console.log(id))
      .then(() => {})
  };
/*
------------------------------------------------------------------------------------------
*/
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { dataSets, dataSet, loading, classes, match, ...props } = this.props;
    const { name, frontEndLevel, backEndLevel, dataLevel, open } = this.state;

    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon />}
        onAction={() => {
          this.setState({ open: true });
        }}
      >
        <Grid container justify="center">
          <Grid item xs={12}>
             <PersonalTable 
            name={dataSet.name}
            frontEndLevel={dataSet.frontEndLevel}
            backEndLevel={dataSet.backEndLevel}
            dataLevel={dataSet.dataLevel}
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
          </Grid>
        </Grid>
      </PageBase>
    );
  }
}

export default withStyles(styles)(ProfilePage);
