import React, { Component } from "react";
import { Link } from "react-router-dom";
import MiscPageBase from "../components/MiscPageBase";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import { findDOMNode } from "react-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { TextField } from "@material-ui/core";
import _ from "lodash";
import callWithPromise from "../../util/callWithPromise";
import Popover from "@material-ui/core/Popover";
import RaisedButtons from "../components/buttons/RaisedButton";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

const T = i18n.createComponent();

const styles = _theme => ({
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400
  },
  paper: {
    padding: 24,
    overflow: "hidden"
  },
  errorContainer: {
    width: 240
  }
});

class EnrollPage extends Component {
  state = {
    user: {},
    errors: {},
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    notFound: false
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  checkErrors = () => {
    const {
      email,
      password,
      firstName,
      lastName,
      confirmPassword
    } = this.state;
    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      //if error return true
      return true;
    }

    return !(password === confirmPassword);
  };

  onSubmit = e => {
    console.log("Submiting");
    e.preventDefault();
    if (!this.checkErrors()) {
      Accounts.createUser(
        {
          email: this.state.email,
          password: this.state.password,
          profile: {
            firstName: this.state.firstName,
            lastName: this.state.lastName
          }
        },
        (err, user) => {
          if (err) throw err;
          console.log(user);
          this.props.history.push("/signin");
        }
      );
    }
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    return (
      <MiscPageBase>
        <Paper
          key="paper"
          square
          className={classNames(classes.container, classes.paper)}
          ref={node => this.container = findDOMNode(node)}
        >
          <Typography variant="h5" paragraph style={{ textAlign: "center" }}>
            Almost there!
          </Typography>
          <Grid container spacing={12} direction="column" alignItems="center">
            <Grid item xs={12}>
              <TextField
                id="emailField"
                inputProps={{ autoComplete: "new-account" }}
                error={!_.isEmpty(errors.email)}
                type="account"
                name="email"
                label={<T>auth.email</T>}
                placeholder="Enter your email"
                onChange={this.onChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="firstName"
                inputProps={{ autoComplete: "new-first-name" }}
                error={!_.isEmpty(errors.firstName)}
                type="firstName"
                name="firstName"
                onChange={this.onChange}
                label={<T>auth.firstName</T>}
                placeholder="First Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="lastName"
                inputProps={{ autoComplete: "new-last-name" }}
                error={!_.isEmpty(errors.lastName)}
                type="lastName"
                name="lastName"
                onChange={this.onChange}
                label={<T>auth.lastName</T>}
                placeholder="Last Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="passwordField"
                inputProps={{ autoComplete: "new-password" }}
                error={!_.isEmpty(errors.password)}
                type="password"
                name="password"
                onChange={this.onChange}
                label={<T>auth.password</T>}
                placeholder="Your password"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="confirmPassword"
                inputProps={{ autoComplete: "new-password" }}
                error={!_.isEmpty(errors.confirmPassword)}
                type="password"
                name="confirmPassword"
                onChange={this.onChange}
                label={<T>auth.confirmPassword</T>}
                placeholder="Enter password again"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <RaisedButtons color="secondary" onClick={this.onSubmit}>
                Register
              </RaisedButtons>
            </Grid>
          </Grid>
        </Paper>
        <Popover
          key="popover"
          open={!_.isEmpty(errors.misc)}
          onClose={this.onClosePopover}
          anchorEl={this.container}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          classes={{ paper: classNames(classes.paper, classes.errorContainer) }}
          PaperProps={{ square: true }}
        >
          <Typography>
            <T>auth.signInError</T>
          </Typography>
        </Popover>
      </MiscPageBase>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(EnrollPage));
