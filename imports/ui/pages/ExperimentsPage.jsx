import React from "react";
import _ from "lodash";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

import PageBase from "../components/PageBase";
import SearchBox from "../components/experiments/SearchBox";
import ResultPanel from "../components/experiments/ResultPanel";
import ExperimentStepper from "../components/experiments/ExperimentStepper";
import callWithPromise from "/imports/util/callWithPromise";

const styles = theme => ({
  lastExperiment: {
    padding: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 2
  }
});

function getSteps() {
  return ["Select data sets", "Set experiment params", "View results"];
}

class ExperimentsPage extends React.Component {
  componentDidMount() {
    if (!this.props.querySelected) {
      this.props.pushMessage("Select a query to see insights.");
      this.props.history.push("/");
    }
  }

  state = {
    query: "",
    queries: [],
    loaded: false,
    error: null,
    isLoading: false,
    imageSegmentation: false,
    imageFeatures: true,
    colors: [],
    tags: [],
    results: [],
    imageResult: "",
    labels: [],
    activeStep: 0, // for experiment stepper
    dataSets: [],
    dataSet_id: "",
    selectedDataSetsIndex: "",
    isQuickExperimentOn: false
  };

  //-----------------event handlers for experimemt stepper------------------------------------

  handleDataSetClick = index => () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
      dataSets: this.props.dataSets[index],
      selectedDataSetsIndex: index
    });
  };

  totalSteps = () => {
    return getSteps().length;
  };

  handleStep = step => () => {
    if (_.isEmpty(this.state.dataSets)) {
      this.props.pushMessage("Please select a data Set first");
    } else {
      this.setState({
        activeStep: step
      });

      if (step == 2) {
        this.handleRunExperiment();
      }
    }
  };

  handleRunExperiment = () => {
    // used in stepper 3
    if (_.isEmpty(this.state.dataSets.URLs)) {
      this.props.pushMessage("Please select a data Set first");
    } else {
      this.setState({
        results: [],
        isLoading: true,
        activeStep: 2
      });
      let promise = Promise.resolve();
      this.state.dataSets.URLs.forEach(element => {
        // promise in a loop
        promise = promise.then(() => this.fetchURL(element));
      });
      promise.finally(() => {
        if (!_.isEmpty(this.state.results)) {
          callWithPromise("dataSet.create", { URLs: this.state.queries }) // save target URLs to the database
            .then(id => this.setState({ dataSet_id: id }))
            .catch(error => this.setState(error));

          callWithPromise("experiment.create", {
            results: this.state.results,
            dataSet_id: this.state.dataSet_id
          })
            .then(this.setState({ isLoading: false, requestCanceled: false }))
            .catch(error => this.setState(error));
        } else {
          this.setState({
            isLoading: false,
            requestCanceled: false
          });
        }
      });
    }
  };

  handleSaveModal = (params = {}) => {
    callWithPromise("dataSet.update", {
      dataSet_id: params.id,
      _name: params.newName,
      _description: params.newDescription
    })
      .then(() => {}) // save dataSet name
      .catch(error => this.setState({ error }));
  };

  handleDeleteDataSet = (params = {}) => {
    callWithPromise("dataSet.delete", {
      dataSet_id: params.id
    })
      .then(() => {})
      .catch(error => console.log(error));
  };
  //------------------event handlers for search box--------------------------------------------

  handleInputChange = event => {
    this.setState({
      query: event.target.value
    });
  };

  handeleDeleteURL = deleteIndex => {
    event.preventDefault();
    const queries = this.state.queries.filter(
      (query, index) => index !== deleteIndex
    ); //Lodash refactor
    this.setState({ queries });
  };

  handleAddURL = event => {
    event.preventDefault();
    if (_.isEmpty(this.state.query)) {
      this.props.pushMessage("Please enter a valid URL");
    } else {
      this.setState({
        queries: [...this.state.queries, this.state.query],
        query: ""
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    this.setState({ results: [], isLoading: true, isQuickExperimentOn: true });
    let promise = Promise.resolve();

    this.state.queries.forEach(element => {
      // render results from the selected dataSet in step 3 only with state data
      promise = promise.then(() => this.fetchURL(element));
    });

    promise.finally(() => {
      this.setState({
        isLoading: false,
        requestCanceled: false,
        selectedDataSetsIndex: "",
        isQuickExperimentOn: true
      });
    });
  };

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleCancelRequest = event => {
    event.preventDefault();
    this.setState({ requestCanceled: true }); // help to cancel the request in the loop
    this.cancelRequest(); // cancel the current request thread
  };

  //------------------core logic for data acquisition--------------------------------------------

  fetchURL = targetURL => {
    if (this.state.requestCanceled) {
      return Promise.resolve();
    }
    const API_URL = "https://marka.ngrok.io/graphql";
    const queryString = `
    mutation {
      imageSegmentation(image: {url: "${targetURL}" }) {
        imageResult
        labels {
          name
          num
        }
      }
      imageFeatures(image: { url: "${targetURL}" }) {
        people {
          product {
            colors{
              rgb
              percent
            }
            tags{
              name
              score
            }
          }
        }
        products {
          colors{
            rgb
            percent
          }
          tags{
            name
            score
          }
        }
      }
    }`;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    this.cancelRequest = () => {
      source.cancel("request canceled");
    };

    const axiosPromise = axios({
      method: "post",
      url: API_URL,
      data: { query: queryString },
      cancelToken: source.token,
      timeout: 60000 // set request default timeout
    })
      .then(response => {
        if (response.status == 200) {
          return response.data;
        } else {
          this.props.pushMessage("something went wrong,please try again");
        }
      })
      .then(response => {
        const people = _.get(response, [
          "data",
          "imageFeatures",
          "people",
          0,
          "product"
        ]); // to see if image is people or product
        const peopleColors = [].concat(
          ..._.map(
            _.get(response, ["data", "imageFeatures", "people"]),
            element => {
              return element.product.colors;
            }
          )
        );
        const peopleTags = [].concat(
          ..._.map(
            _.get(response, ["data", "imageFeatures", "people"]),
            element => {
              return element.product.tags;
            }
          )
        );
        const productColors = [].concat(
          ..._.map(
            _.get(response, ["data", "imageFeatures", "products"]),
            element => {
              return element.colors;
            }
          )
        );
        const productTags = [].concat(
          ..._.map(
            _.get(response, ["data", "imageFeatures", "products"]),
            element => {
              return element.tags;
            }
          )
        );
        const imageResult = _.get(response, "data", "imageSegmentation");

        if (_.isEmpty(people)) {
          let response = {
            product: { productColors, productTags },
            imageResult
          };

          this.setState({
            colors: response.product.productColors,
            tags: response.product.productTags,
            imageResult: response.imageResult.imageSegmentation.imageResult,
            labels: response.imageResult.imageSegmentation.labels,
            results: [
              ...this.state.results,
              {
                query: targetURL,
                colors: response.product.productColors,
                tags: response.product.productTags,
                imageResult: response.imageResult.imageSegmentation.imageResult,
                labels: response.imageResult.imageSegmentation.labels
              }
            ],
            query: "",
            loaded: true,
            isLoading: true
          });
        } else {
          let response = { people: { peopleColors, peopleTags }, imageResult };
          this.setState({
            colors: response.people.peopleColors,
            tags: response.people.peopleTags,
            imageResult: response.imageResult.imageSegmentation.imageResult,
            labels: response.imageResult.imageSegmentation.labels,
            results: [
              ...this.state.results,
              {
                query: targetURL,
                colors: response.people.peopleColors,
                tags: response.people.peopleTags,
                imageResult: response.imageResult.imageSegmentation.imageResult,
                labels: response.imageResult.imageSegmentation.labels
              }
            ],
            query: "",
            loaded: true,
            isLoading: true
          });
        }
      })
      .catch(error => {
        if (error.message == "request canceled") {
          this.props.pushMessage("request canceled");
        } else if (error.message == "timeout of 30000ms exceeded") {
          this.props.pushMessage("request timed out,please try again");
        } else
          this.props.pushMessage("something went wrong,please try again");
      })
      .finally();

    return axiosPromise;
  };

  render() {
    const {
      dataSets,
      pastExperiments,
      users,
      classes,
      latestExperiments,
      showRemoved,
      ...props
    } = this.props;
    const {
      query,
      queries,
      isLoading,
      imageSegmentation,
      imageFeatures,
      activeStep,
      results,
      selectedDataSetsIndex,
      isQuickExperimentOn
    } = this.state;

    const steps = getSteps();

    return (
      <PageBase {...props}>
        <Grid container spacing={8} justify="center">
          <Grid item xs={12}>
            {this.state.activeStep == 0 &&
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    Click to have quick experiments
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <SearchBox
                        query={query}
                        queries={queries}
                        onSubmitQuery={this.handleSubmit}
                        onInputChange={this.handleInputChange}
                        onDeleteURL={this.handeleDeleteURL}
                        onAddURL={this.handleAddURL}
                        isLoading={isLoading}
                        onCheck={this.handleCheck}
                        imageSegmentation={imageSegmentation}
                        imageFeatures={imageFeatures}
                        onCancelRequest={this.handleCancelRequest}
                      />
                      {this.state.isLoading &&
                        <LinearProgress color="secondary" />}
                      {this.state.activeStep == 0 &&
                        results.map((element, index) => (
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
                </ExpansionPanelDetails>
              </ExpansionPanel>}
          </Grid>
          <Grid item xs={12}>
            <ExperimentStepper
              results={results}
              isLoading={isLoading}
              isQuickExperimentOn={isQuickExperimentOn}
              imageSegmentation={imageSegmentation}
              imageFeatures={imageFeatures}
              onCheck={this.handleCheck}
              activeStep={activeStep}
              onStep={this.handleStep}
              pastExperiments={pastExperiments}
              steps={steps}
              dataSets={dataSets}
              latestExperiments={latestExperiments}
              onDataSetClick={this.handleDataSetClick}
              selectedDataSetsIndex={selectedDataSetsIndex}
              onRunExperiment={this.handleRunExperiment}
              onSaveModal={this.handleSaveModal}
              onDeleteDataSet={this.handleDeleteDataSet}
            />
          </Grid>
        </Grid>
      </PageBase>
    );
  }
}
export default withStyles(styles)(ExperimentsPage);
