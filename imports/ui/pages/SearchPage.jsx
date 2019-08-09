import React from "react";
import PageBase from "../components/PageBase";
import "react-widgets/dist/css/react-widgets.css";
import DropDownList from "react-widgets/lib/DropdownList";
import { withStyles } from "@material-ui/styles";
import AdminTab from "../components/admin/AdminTab";

const styles = theme => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    backgroundColor: "black"
  },
})
class SearchPage extends React.Component {
  render() {
    return (
      <PageBase {...this.props}>
        olllpl
      </PageBase>
    );
  }
}

export default withStyles(styles)(SearchPage);