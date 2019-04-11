import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import moment from 'moment';

import withSession from '/imports/ui/helpers/withSession';
import callWithPromise from '/imports/util/callWithPromise';
import { userHasRole } from '/imports/api/users/User';

import RaisedButton from '/imports/ui/components/buttons/RaisedButton';
import Button from '@material-ui/core/Button';

import Collapse from '@material-ui/core/Collapse';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreIcon from '@material-ui/icons/SettingsBackupRestore';

const styles = theme => ({
  message: {
    height: 24,
  },
  row: {
    width: '90%',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 0,
    },
  },
  check: {
    color: theme.palette.primary.dark,
  },
  removed: {
    '& > div': {
      opacity: 0.5,
    }
  },
  removeButtonGrid: {
    opacity: '1 !important',
  },
  actionIcon: {
    margin: theme.spacing.unit,
  },
  userCell: {
    textAlign: 'center',
  },
  noPadding: {
    padding: '0 !important',
  },
});

const UserRow = withStyles(styles)(({ user, setAdmin, onToggleRemoved, displaySuccess, error, classes }) => (
  <Grid key={user._id} item xs={12} className={classes.row}>
    <Grid container alignItems="center" className={classNames({ [classes.removed]: user.removed })}>
      <Grid item className={classes.userCell} xs={12} sm={7}>
        <Typography>{ user.email() }</Typography>
        { user.removed && <Typography>Removed { moment(user.removedAt).format() }</Typography> }
        { user.removed && <Typography>({ moment(user.removedAt).fromNow() })</Typography> }
      </Grid>
      <Grid item className={classes.userCell} xs={12} sm={2}>
        <FormControlLabel
          control={<Switch disabled={user.removed} checked={userHasRole(user, 'admin')} onChange={(ev) => setAdmin(user, ev.target.checked)} />}
          label="Admin" />
      </Grid>
      <Grid item xs={12} sm={2} className={classNames(classes.removeButtonGrid, classes.userCell)}>
        <Button onClick={onToggleRemoved}>
          { user.removed ? <RestoreIcon className={classes.actionIcon} /> : <DeleteIcon className={classes.actionIcon} /> }
          { user.removed ? "Restore" : "Delete" }
        </Button>
      </Grid>
      <Grid item className={classNames(classes.userCell, classes.noPadding)} xs={12} sm={1}>
        <Collapse in={displaySuccess}>
          <CheckIcon className={classes.check} />
        </Collapse>
      </Grid>
      <Grid item className={classNames(classes.userCell, classes.noPadding)} xs={12} sm={12}>
        <Collapse in={!_.isEmpty(error)}>
          { error }
        </Collapse>
      </Grid>
    </Grid>
  </Grid>
));

class UserList extends React.Component {
  state = {
    errors: {},
    success: {},
    showMessage: false,
  }

  componentDidMount() {
    this.setSuccessClearTimer();
  }

  /* Given a user and a promise, reset errors and success indicators, and
   * set them anew based on the result of the promise */
  wrapUserTransaction = (user, promise) => {
    this.resetUserMessages(user);
    promise.then(() => this.setSuccess(user, true))
           .catch(error => this.setForUser('errors', user, error.reason))
  }

  onToggleRemoved = (user) => () => {
    const promise = user.removed ? user.restore() : user.softDelete();
    this.wrapUserTransaction(user, promise);
  }

  setAdmin = (user, isAdmin) => {
    this.wrapUserTransaction(user, user.setRole('admin', isAdmin));
  }

  setForUser = (stateKey, user, value) => {
    this.setState({
      [stateKey]: Object.assign({}, this.state[stateKey], { [user._id]: value })
    });
  }

  setSuccess = (user) => {
    this.resetSuccessClearTimer();
    this.setForUser('success', user, true);
  }

  resetUserMessages = (user) => {
    this.setForUser('success', user, false);
    this.setForUser('errors', user, false);
  }

  setSuccessClearTimer = () => {
    this.successClearInterval = setInterval(() => this.setState({ success: {} }), 10000);
  }

  resetSuccessClearTimer = () => {
    clearInterval(this.successClearInterval);
    this.setSuccessClearTimer();
  }

  render() {
    const { classes, users, session, setSession } = this.props;
    const { showRemoved } = session;
    const { errors, success } = this.state;
    const displayUsers = showRemoved ? users : users.filter(u => !u.removed || success[u._id])

    return (
      <Grid container spacing={16} direction="column" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="headline" paragraph style={{ textAlign: 'center' }}>
            Users
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={showRemoved} onChange={(ev) => setSession({ showRemoved: ev.target.checked })} />}
            label="Show removed users" />
        </Grid>
        { displayUsers.map(user => (
            <UserRow key={user._id}
              user={user}
              setAdmin={this.setAdmin}
              onToggleRemoved={this.onToggleRemoved(user)}
              displaySuccess={success[user._id]}
              error={errors[user._id]} />
          )) }
      </Grid>
    )
  }
}

export default withStyles(styles, { withTheme: true })(withSession('UserListOptions', { showRemoved: false })(UserList));
