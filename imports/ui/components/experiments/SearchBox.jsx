import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import DirectionsRun from "@material-ui/icons/DirectionsRun";

import URLList from "./URLList";
import QueryCheckBox from "./QueryCheckBox";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit
  },
  textField: {
    margin: theme.spacing.unit,
    textAlign: "center"
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  run: {
    marginLeft: theme.spacing.unit
  },
  cancel: {
    marginLeft: theme.spacing.unit
  }
});

const SearchBox = props => {
  const {
    classes,
    query,
    queries,
    onSubmitQuery,
    onInputChange,
    onDeleteURL,
    onAddURL,
    isLoading,
    onCheck,
    imageFeatures,
    imageSegmentation,
    onCancelRequest
  } = props;

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <form onSubmit={onSubmitQuery}>
            <Grid container justify="center">
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  className={classes.textField}
                  placeholder="Start a quick experiment by adding URLs"
                  value={query}
                  onChange={onInputChange}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  disabled={isLoading}
                  mini
                  color="secondary"
                  aria-label="Add"
                  onClick={onAddURL}
                >
                  <AddIcon />
                </Button>
              </Grid>
              <Grid container justify="center">
                <Grid item xs={12}>
                  <URLList
                    isLoading={isLoading}
                    query={query}
                    queries={queries}
                    onDeleteURL={onDeleteURL}
                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item>
                  <QueryCheckBox
                    isLoading={isLoading}
                    imageSegmentation={imageSegmentation}
                    imageFeatures={imageFeatures}
                    onCheck={onCheck}
                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                {isLoading
                  ? <Button
                      variant="contained"
                      color="secondary"
                      className={classes.cancel}
                      onClick={onCancelRequest}
                    >
                      Cancel Request
                    </Button>
                  : <Button
                      disabled={isLoading}
                      variant="contained"
                      type="submit"
                      color="secondary"
                      className={classes.button}
                    >
                      Run
                      <DirectionsRun className={classes.run} />
                    </Button>}
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(SearchBox);
