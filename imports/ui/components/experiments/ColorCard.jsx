import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Color from "color";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "row",
    margin: theme.spacing.unit,
    height: 60,
    minWidth: 200
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  colorSection: {
    width: 50
  },
  content: {
    flex: "1 0 auto"
  }
});

const ColorCard = props => {
  const { classes, rgb, percent } = props;

  return (
    <Card className={classes.card}>
      <div style={{ background: Color.rgb(rgb).hex(), width: 50 }} />
      <CardContent className={classes.content}>
        <Typography variant="body1">
          Hex : {Color.rgb(rgb).hex()}
        </Typography>
        <Typography variant="body1">
          Percent: {percent}
        </Typography>
      </CardContent>
    </Card>
  );
}

ColorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ColorCard);
