import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import PageBase from "../components/PageBase";
import EnhancedTable from "../components/Profile/EnhancedTable";
import TotalUsers from "../components/board/TotalUsers";
import TotalProgress from "../components/board/TotalProgress";
import Budget from "../components/board/Budget";
import TotalProfit from "../components/board/TotalProfit";

class BoardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [[{ value: 1 }, { value: 3 }], [{ value: 2 }, { value: 4 }]]
    };
  }

  render() {
    const {
      dataSets,
      loading,
      classes,
      match,
      frontendSkills,
      backendSkills,
      dataSkills,
      ...props
    } = this.props;

    return (
      <PageBase {...props} actionIcon={<AddIcon />}>
        <Grid container spacing={4}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalUsers />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProgress />
          </Grid>
        </Grid>
        <EnhancedTable
          data={
            dataSets
          } /*Pass data from the container to enhanced table as props */
          frontendSkills={frontendSkills}
          backendSkills={backendSkills}
          dataSkills={dataSkills}
        />
      </PageBase>
    );
  }
}

export default compose(withRouter)(BoardPage);
