import React from 'react';
import { findDOMNode } from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Accounts } from 'meteor/accounts-base'
import callWithPromise from '/imports/util/callWithPromise';

import RaisedButton from '/imports/ui/components/buttons/RaisedButton';

import Collapse from '@material-ui/core/Collapse';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  message: {
    height: 24,
  },
});

class CreateUserForm extends React.Component {
  state = {
    errors: {},
    email: '',
    message: '',
    showMessage: false,
  }

  onSubmit = event => {
    event.preventDefault();
    const { email } = this.state;
    const errors = {};

    if (!email) {
      errors.email = 'Email Required';
    }

    if (Object.keys(errors).length) {
      return;
    }

    callWithPromise('users.create', email)
      .then(this.notifyAndReset)
      .catch(err => this.setState({ errors: { email: err.reason } }))
  }

  notifyAndReset = () => {
    this.setState({
      message: 'Account created. An enrollment link was sent to the email you entered.',
      showMessage: true,
      errors: {},
      email: '',
    }, () => setTimeout(() => this.setState({ showMessage: false }), 3000));
  }

  updateField = (field, value) => {
    this.setState({ [field]: value, errors: {} });
  }

  render() {
    const { classes } = this.props;
    const { errors, message, showMessage, email, working } = this.state;
    const errorClass = key => errors[key] && 'error';

    return (
      <form onSubmit={this.onSubmit}>
        <Grid container spacing={16} direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="headline" paragraph style={{ textAlign: 'center' }}>
              Create User
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email-create"
              disabled={working}
              error={!_.isEmpty(errors.email)}
              helperText={errors.email}
              type="email"
              name="email"
              value={email}
              onChange={({ target: {value} }) => this.updateField('email', value)}
              label="Email"
              placeholder="Email"
              fullWidth
            />
          </Grid>
          <RaisedButton type="submit" color="secondary">
            Create
          </RaisedButton>
          <Grid item xs={12} className={classes.message}>
            <Collapse in={showMessage}>
              <Typography>{ message }</Typography>
            </Collapse>
          </Grid>
        </Grid>
      </form>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CreateUserForm);
