import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import TagCard from "./TagCard";

const styles = theme => ({
  segmentationLeft: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  segmentationRight: {
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

const ImageSegmentationResults = props => {
  const { classes, imageResult, labels } = props;

  return (
    <Grid container spacing={8} justify="center">
      <Grid item xs={12} md={6} className={classes.segmentationLeft}>
        <img
          src={imageResult}  // remain to be set
          width='100%'
          height='auto'
        />
      </Grid>
      <Grid item xs={12} md={6} className={classes.segmentationRight}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography gutterBottom component="h3">
                  Labels
                </Typography>
                <Grid container justify="center">
                  <Grid item xs={12}>
                    {labels.map((tag, index) => (
                      <TagCard key={index} name={tag.name} />
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(ImageSegmentationResults);
