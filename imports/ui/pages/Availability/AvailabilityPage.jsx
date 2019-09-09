import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import AvailabilityToolbar from "./AvailabilityToolbar";
import Table from "@material-ui/core/Table";
import AvailabilityPageHead from "./AvailabilityPageHead";
import TableBody from "@material-ui/core/TableBody";
import { TableRow } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core/styles";
import PageBase from "../../components/PageBase";


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

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: "auto"
  }
});
class AvailabilityPage extends Component {
  state = {
    order: "asc",
    orderBy: "practitioner",
    page: 0,
    rowsPerPage: 10
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { rowsPerPage, page, order, orderBy } = this.state;
    const { rows, data, classes } = this.props;

    console.log(data)
    return (
     <PageBase {...this.props}>
       <Paper className={classes.root}>
         <AvailabilityToolbar title="Availabilities" variant="h6"/>
         <div>
           <Table className={classes.table} size="small">
             <AvailabilityPageHead
               order={order}
               orderBy={orderBy}
               onRequestSort={this.handleRequestSort}
               rows={rows}
               align="center"
               data={data}
             />
             <TableBody>
               {stableSort(data,getSorting(order,orderBy))
                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                 .map((n,index) => {
                   const labelId = `table-checkbox-${index}`;
                   return(
                     <TableRow key={n.practitioner}>
                       <TableCell variant='body' component="th" key={labelId} scope="row" align="center" padding="none">
                         {/* <Typography variant="body2" gutterBottom> */}
                           {n.practitioner}
                         {/* <Typography /> */}
                       </TableCell>
                       <TableCell style={{whiteSpace:"pre-line"}} align='center'>
                         {n.availability.map(record => (
                           <span key={record}>
                            {record}
                             <br/>
                          </span>
                         ))}
                       </TableCell>
                     </TableRow>
                   )
                 })
               }
             </TableBody>
           </Table>
         </div>
         <TablePagination
           component="div"
           rowsPerPageOptions={[5, 10, 25]}
           count={data.length}
           rowsPerPage={rowsPerPage}
           page={page}
           backIconButtonProps={{
             "aria-label": "previous page"
           }}
           nextIconButtonProps={{
             "aria-label": "next page"
           }}
           onChangePage={this.handleChangePage}
           onChangeRowsPerPage={this.handleChangeRowsPerPage}
         />
       </Paper>
     </PageBase>
    );
  }
}

export default withStyles(styles)(AvailabilityPage);