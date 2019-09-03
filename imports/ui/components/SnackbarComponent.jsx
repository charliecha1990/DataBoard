import React, { Component } from "react";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import ErrorIcon from "@material-ui/icons/Error";
import classNames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  snackbar: {
    backgroundColor: theme.palette.error.dark
  },

  message: {
    alignItems: "center"
  },
  icon: {
    fontsize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
});

class SnackbarComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      open:this.props.open
    }
  }
  render() {
    const {classes} = this.props;
    return (
      <Snackbar open={this.state.open} autoHideDuration={3000}
                onClose={() => this.setState({ open: false })}>
        <SnackbarContent
          className={classes.snackbar}
          message={
            <span id="client-snackbar" className={classes.message}>
                <ErrorIcon className={classNames(classes.icon,classes.iconVariant)}/>
              {this.props.message}
              </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() => this.setState({ open: false })}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
        >
        </SnackbarContent>
      </Snackbar>
    );
  }
}

export default withStyles(styles)(SnackbarComponent);