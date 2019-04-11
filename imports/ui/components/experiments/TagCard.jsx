import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const styles = theme => ({
  chip: {
    // padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  title: {
    fontSize: 10,
    color: theme.color
  }
});

const TagCard = props => {
  const { classes, name } = props;

  return <Chip className={classes.chip} label={name} />;
}

TagCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TagCard);
