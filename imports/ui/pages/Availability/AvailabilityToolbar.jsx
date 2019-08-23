import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  title: {
    flex: "0 0 auto"
  }
});

function AvailabilityToolbar(props) {
  const {classes,title,variant} = props;
  return(
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant = {variant}>
          {title}
        </Typography>
      </div>
    </Toolbar>
  )
}


export default withStyles(styles)(AvailabilityToolbar);