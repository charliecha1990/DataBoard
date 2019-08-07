import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import DisplayRow from "./DisplayRow";
import EnhancedTableHead from "./EnhancedTableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Paper from "@material-ui/core/Paper";
import {flattenData,createRows,mapDataNew} from "../../../util/getDatabaseFields";


let counter = 0;


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}


const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

/*
@author:Sujay
maps data from props to the format {id,practitioner,frontEnd,backEnd,data}
 */
let mapData = (allRecords) => {
  // console.log("All records ",allRecords[0]);

  return allRecords.map((c) => ({
    id: ++counter, practitioner: c["name"], frontEnd: c["frontEndLevel"],
    backEnd: c["backEndLevel"], data: c["dataLevel"]
  }));
};

class EnhancedTable extends React.Component {

  /*
  @author:Sujay
  removed data field from state
   */
  state = {
    order: "asc",
    orderBy: "practitioner",
    selected: [],
    mockData: {
      practitioner: "string",
      frontEnd: "string",
      backEnd: "string",
      dataLevel: "string"
    },
    page: 0,
    rowsPerPage: 5
  };


  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };


  render() {
    const { classes, frontendSkills, backendSkills, dataSkills } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    let dynamicRows = createRows(frontendSkills, backendSkills, dataSkills);
    let newData = mapDataNew(this.props.data, dynamicRows);
    // const data = mapData(this.props.data); /* @author:Sujay. Removed data from state and got it from props*/
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, newData.length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={newData.length}
              rows={dynamicRows}
              data={newData}
            />

            <TableBody>
              {stableSort(newData, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  // const isSelected = this.isSelected(n.id);
                  return (
                    <DisplayRow key={n.id} row={n}/>

                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6}/>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={newData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);