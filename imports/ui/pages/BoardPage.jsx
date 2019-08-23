import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import AddIcon from "@material-ui/icons/Add";

import PageBase from "../components/PageBase";
import EnhancedTable from "../components/Profile/EnhancedTable";


class BoardPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      grid: [
        [{ value: 1 }, { value: 3 }],
        [{ value: 2 }, { value: 4 }]
      ]
    };
  }

  render() {
    const { dataset, loading, classes, match, frontendSkills, backendSkills, dataSkills, ...props } = this.props;

    return (
      <PageBase
        {...props}
        actionIcon={<AddIcon/>}
      >
        <EnhancedTable
          data={dataset} /*Pass data from the container to enhanced table as props */
          frontendSkills={frontendSkills}
          backendSkills={backendSkills}
          dataSkills={dataSkills}
        />
      </PageBase>
    );
  }
}

export default compose(
  withRouter
)(BoardPage);
