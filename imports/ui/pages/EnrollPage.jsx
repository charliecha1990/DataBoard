import React from 'react';
import { findDOMNode } from 'react-dom';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import callWithPromise from '/imports/util/callWithPromise';

import { Link } from 'react-router-dom';

import RaisedButton from '/imports/ui/components/buttons/RaisedButton';
import Loading from '/imports/ui/components/Loading';
import MiscPageBase from '/imports/ui/components/MiscPageBase';

import Collapse from '@material-ui/core/Collapse';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

const styles = (theme) => ({
	container: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 360
	},
	paper: {
		padding: 24,
		overflow: 'hidden'
	},
	errorContainer: {
		width: 240
	}
});

class LoginPage extends React.Component {
	state = {
		user: {},
		errors: {},
		email: '',
		password: '',
		confirm: '',
		notFound: false
	};

	componentDidMount() {
		const token = this.props.match.params.token;
		callWithPromise('users.findByToken', token).then(
			(user) => (_.isEmpty(user) ? this.setState({ notFound: true }) : this.setState({ user, token }))
		);
	}

	onSubmit = (event) => {
		event.preventDefault();
		this.setState({ working: true }, () =>
			this.createAccount()
				.then(() => this.props.history.push('/'))
				.catch((errors) => this.setState({ errors }))
				.finally(() => this.setState({ working: false }))
		);
	};

	createAccount = () =>
		new Promise((resolve, reject) => {
			const { password, confirm, token } = this.state;
			const errors = {};

			if (!password) {
				errors.password = 'Password required';
			}
			if (!confirm) {
				errors.password = 'Confirmation required';
			}
			if (password !== confirm) {
				errors.confirm = 'Passwords do not match';
			}

			if (Object.keys(errors).length) {
				return reject(errors);
			}

			Accounts.resetPassword(token, password, (error = false) => {
				if (error) {
					reject({ misc: error });
				} else {
					resolve();
				}
			});
		});

	onClosePopover = () => {
		this.setState({ errors: {} });
	};

	updateField = (field, value) => {
		this.setState({ [field]: value });
	};

	render() {
		const { classes } = this.props;
		const { errors, user, password, confirm, working, notFound } = this.state;
		const errorClass = (key) => errors[key] && 'error';

		if (notFound) {
			return (
				<MiscPageBase>
					<Typography variant="title">Whoops! That enrollment link is expired.</Typography>
					<Typography variant="title">
						If you already finalized your account, try <Link to="/login">logging in</Link>.
					</Typography>
				</MiscPageBase>
			);
		}
		if (_.isEmpty(user)) {
			return <Loading />;
		}

		const email = user.email();
		return (
			<MiscPageBase>
				<Paper
					key="paper"
					square
					className={classNames(classes.container, classes.paper)}
					ref={(node) => (this.container = findDOMNode(node))}
				>
					<Typography variant="headline" paragraph style={{ textAlign: 'center' }}>
						Almost there! Time to create a password for your Sibyl account.
					</Typography>
					<Grid container spacing={16} direction="column" alignItems="center">
						<Grid item xs={12}>
							<Typography>{email}</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="passwordCreate"
								autoComplete="new-password"
								inputProps={{ autoComplete: 'new-password' }}
								disabled={working}
								error={!_.isEmpty(errors.password)}
								helperText={errors.password}
								type="password"
								name="passwordCreate"
								value={password}
								onChange={({ target: { value } }) => this.updateField('password', value)}
								label={<T>auth.password</T>}
								placeholder={i18n.__('auth.password')}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="confirm"
								autoComplete="new-password"
								inputProps={{ autoComplete: 'new-password' }}
								disabled={working}
								error={!_.isEmpty(errors.confirm)}
								helperText={errors.confirm}
								type="password"
								name="passwordCreateConfirm"
								value={confirm}
								onChange={({ target: { value } }) => this.updateField('confirm', value)}
								label="Confirm password"
								placeholder="Confirm password"
								fullWidth
							/>
						</Grid>
						<RaisedButton color="secondary" onClick={this.onSubmit}>
							Finalize Account
						</RaisedButton>
					</Grid>
				</Paper>
				<Popover
					key="popover"
					open={!_.isEmpty(errors.misc)}
					onClose={this.onClosePopover}
					anchorEl={this.container}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					transformOrigin={{ vertical: 'top', horizontal: 'center' }}
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

export default withStyles(styles, { withTheme: true })(withRouter(LoginPage));
