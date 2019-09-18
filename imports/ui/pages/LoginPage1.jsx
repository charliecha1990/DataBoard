import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Popover from "@material-ui/core/Popover";
import i18n from "meteor/universe:i18n";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Deloitte
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn(props) {
  const classes = useStyles();
  const {onSubmit, email , password, updateField, errors, onEnroll } = props;
  const T = i18n.createComponent();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={onSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={<T>auth.email</T>}
            name="email"
            value={email}
            autoComplete="email"
            onChange={({ target: { value } }) => updateField("email", value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            name="password"
            label={<T>auth.password</T>}
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={({ target: { value } }) => updateField("password", value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            <T>auth.signInButton</T>
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" color="textSecondary">
                Forgot password?
              </Link>         
            </Grid>
            <Grid item>
              <Link href='http://172.20.10.11:3000/enroll' variant="body2" color="textSecondary">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs>
              <Link href="http://172.20.10.11:3000" variant="body2" color="textSecondary">
                Deloitte SSO
              </Link>         
            </Grid>
          </Grid>
        </form>
      </div>
      <Popover key="popover"
                 open={!_.isEmpty(errors)}
                 onClose={this.onClosePopover}
                 anchorEl={this.container}
                 anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                 transformOrigin={{ vertical: "top", horizontal: "center" }}
                 styles={{ width: 240 }}
                 PaperProps={{ square: true }}>
          <Typography>
            <T>Errors</T>
          </Typography>
        </Popover>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default class LoginPage1 extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            email: "",
            password: ""
        }
    }

    componentWillMount() {
        if (!_.isEmpty(Meteor.userId())) {
          this.props.history.push("/");
        }
    }
    
    handleSubmit = event => {
        event.preventDefault();
    
        const email = this.state.email;
        const password = this.state.password;
        const errors = {};
    
        if (!email) {
          errors.email = "Email Required";
        }
        if (!password) {
          errors.password = "Password Required";
        }
    
        this.setState({ errors });
        if (Object.keys(errors).length) {
          return;
        }
    
        Meteor.loginWithPassword(email, password, (err) => {
          if (err) {
            this.setState({
              errors: { misc: err.reason }
            });
          } else {
            this.props.history.push("/");
          }
        });
      };
    
    
    handleEnroll = event => {
        event.preventDefault();
        this.props.history.push("/enroll");
    }

    updateField = (field, value) => {
        this.setState({ [field]: value });
    };

    render () {
        const { email, password, errors } = this.state;

        return (
            <SignIn 
                onSubmit={this.handleSubmit} 
                email={email} 
                password={password}
                updateField={this.updateField}
                errors={errors}
                onEnroll={this.handleEnroll}
            />
            
        )
    }
}