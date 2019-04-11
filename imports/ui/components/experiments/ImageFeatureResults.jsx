import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import ColorCard from "./ColorCard";
import TagCard from "./TagCard";

const styles = theme => ({
  imageFeaturesLeft: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2
  },
  imageFeaturesRight: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2
  },
  tagCard: {
    display: "inline"
  },
  colorCard: {
    display: "inline"
  }
});

const ImageFeatureResults = props => {
  const { classes, colors, tags, query } = props;

  return (
    <Grid container spacing={8} justify="center">
      <Grid item xs={12} md={6} className={classes.imageFeaturesLeft}>
        <img
          src={query}  // remain to be set
          width='100%'
          height='auto'
        />
      </Grid>
      <Grid item xs={12} md={6} className={classes.imageFeaturesRight}>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.tagCard}>
            <Card>
              <CardContent>
                <Typography gutterBottom component="h3">
                  Tags
                </Typography>
                <Grid container justify="center">
                  <Grid item xs={12}>
                    {tags.map((tag, index) => (
                      <TagCard key={index} name={tag.name} />
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} className={classes.colorCard}>
            <Grid container justify="center">
              <Grid item xs={12} md={6}>
                {colors.map((color, index) => (
                  <ColorCard
                    key={index}
                    backgroundColor={color.rgb}
                    rgb={color.rgb}
                    percent={color.percent}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(ImageFeatureResults);
