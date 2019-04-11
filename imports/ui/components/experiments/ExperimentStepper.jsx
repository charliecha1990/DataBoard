import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import { Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import DirectionsRun from "@material-ui/icons/DirectionsRun";

import DataSet from "./DataSet";
import QueryCheckBox from "./QueryCheckBox";
import ResultPanel from "./ResultPanel";

const styles = theme => ({
  root: {
    width: "100%"
  },
  dataSets: {
    flexGrow: 1
  }
});

class ExperimentStepper extends React.Component {
  render() {
    const {
      classes,
      activeStep,
      imageSegmentation,
      imageFeatures,
      onCheck,
      onStep,
      steps,
      dataSets,
      onDataSetClick,
      isLoading,
      selectedDataSetsIndex,
      isQuickExperimentOn,
      onRunExperiment,
      latestExperiments,
      onSaveModal,
      onDeleteDataSet
    } = this.props;

    return (
      <Grid container justify="center">
        <Grid item xs={12}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepButton onClick={onStep(index)} disabled={isLoading}>
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
          <Grid container justify="center">
            {activeStep == 0 &&
              dataSets.map((element, index) => (
                <DataSet
                  onSaveModal={onSaveModal}
                  selected={index === selectedDataSetsIndex}
                  key={index}
                  onDataSetClick={onDataSetClick}
                  URLs={element.URLs}
                  name={element.name}
                  createdAt={element.createdAt}
                  index={index}
                  id={element._id}
                  description={element.description}
                  onDeleteDataSet={onDeleteDataSet}
                />
              ))}
          </Grid>
          {activeStep == 1 &&
            <Grid container justify="center">
              <QueryCheckBox
                imageSegmentation={imageSegmentation}
                imageFeatures={imageFeatures}
                onCheck={onCheck}
              />
              <Grid container justify="center">
                <Button
                  disabled={isLoading}
                  variant="contained"
                  onClick={onRunExperiment}
                  color="secondary"
                  className={classes.button}
                >
                  Run
                  <DirectionsRun className={classes.run} />
                </Button>
              </Grid>
            </Grid>}
          {isLoading &&
            !isQuickExperimentOn &&
            <LinearProgress color="secondary" />}
          {activeStep == 2 &&
            latestExperiments.map((element, index) => (
              <ResultPanel
                imageSegmentation={imageSegmentation}
                imageFeatures={imageFeatures}
                key={index}
                index={index}
                query={element.query}
                tags={element.tags}
                colors={element.colors}
                imageResult={element.imageResult}
                labels={element.labels}
              />
            ))}
        </Grid>
      </Grid>
    );
  }
}

ExperimentStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(ExperimentStepper);
