import React from 'react';
import { findDOMNode } from 'react-dom';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import RaisedButton from '/imports/ui/components/buttons/RaisedButton';
import MiscPageBase from '/imports/ui/components/MiscPageBase';

import Collapse from '@material-ui/core/Collapse';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

const styles = theme => ({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 360,
  },
  paper: {
    padding: 24,
    overflow: 'hidden',
  },
  errorContainer: {
    width: 240,
  }
});

class LoginPage extends React.Component {
  state = {
    errors: {},
    email: '',
    password: '',
  }

  componentWillMount() {
    if (!_.isEmpty(Meteor.userId())) {
      this.props.history.push('/');
    }
  }

  onSubmit = event => {
    event.preventDefault();

    const email = this.state.email;
    const password = this.state.password;
    const errors = {};

    if (!email) {
      errors.email = 'Email Required';
    }
    if (!password) {
      errors.password = 'Password Required';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({
          errors: { misc: err.reason },
        })//, () => setTimeout(() => this.setState({ errors: {} }), 1000));
      } else {
        this.props.history.push('/');
      }
    });
  }

  handleEnroll = event => {
    event.preventDefault();
    console.log("enroll starts");
    this.props.history.push('/enroll-account');
  }

  onClosePopover = () => {
    this.setState({ errors: {} });
  }

  updateField = (field, value) => {
    this.setState({ [field]: value });
  }

  render() {
    const { classes } = this.props;
    const { errors, email, password, working } = this.state;
    const errorClass = key => errors[key] && 'error';

    return (
      <MiscPageBase>
        <Paper key="paper" square className={classNames(classes.container, classes.paper)} ref={node => this.container = findDOMNode(node)}>
          <form onSubmit={this.onSubmit}>
            <Typography variant="title" paragraph style={{ textAlign: 'center' }}>
              <T>auth.signInTitle</T>
            </Typography>
            <Grid container spacing={16} direction="column" alignItems="center">
              <Grid item xs={12}>
                <TextField
                  id="email"
                  autoComplete="username"
                  disabled={working}
                  error={!_.isEmpty(errors.email)}
                  helperText={errors.email}
                  type="email"
                  name="email"
                  value={email}
                  onChange={({ target: {value} }) => this.updateField('email', value)}
                  label={<T>auth.yourEmail</T>}
                  placeholder={i18n.__('auth.yourEmail')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  autoComplete="current-password"
                  disabled={working}
                  error={!_.isEmpty(errors.password)}
                  helperText={errors.password}
                  type="password"
                  name="password"
                  value={password}
                  onChange={({ target: {value} }) => this.updateField('password', value)}
                  label={<T>auth.password</T>}
                  placeholder={i18n.__('auth.password')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <RaisedButton type="submit" color="secondary">
                  <T>auth.signInButton</T>
                </RaisedButton>
                <RaisedButton onClick={this.handleEnroll} color="secondary">
                  <T>auth.EnrollButton</T>
                </RaisedButton>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <Popover key="popover"
          open={!_.isEmpty(errors.misc)}
          onClose={this.onClosePopover}
          anchorEl={this.container}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          classes={{ paper: classNames(classes.paper, classes.errorContainer) }}
          PaperProps={{ square: true }}>
          <Typography>
            <T>auth.signInError</T>
          </Typography>
        </Popover>
      </MiscPageBase>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(LoginPage));
