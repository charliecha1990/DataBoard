import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import Grid from "@material-ui/core/Grid";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";

import EnhancedTableToolbar from './EnhancedTableToolbar'

let counter = 0;

function createData(practitioner, frontEnd, backEnd, data) {
  counter += 1;
  return { id: counter, practitioner, frontEnd, backEnd, data };
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

const rows = [
  { id: "practitioner", numeric: false, disablePadding: true, label: "Practitioner" },
  { id: "backEnd", numeric: true, disablePadding: false, label: "Back-end" },
  { id: "frontEnd", numeric: true, disablePadding: false, label: "Front-end" },
  { id: "data", numeric: true, disablePadding: false, label: "Data" },
  { id: "requestDate", numeric: true, disablePadding: false, label: "Request Date" }
  // { id: 'Notes', numeric: true, disablePadding: false, label: 'Notes' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class RequestForm extends React.Component {
  state = {
    order: "asc",
    orderBy: "practitioner",
    selected: [],
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
      this.setState(state => ({ selected: this.props.requestArray.map(n => n._id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = id => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, onApprove, requestArray } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, requestArray.length - page * rowsPerPage);

    console.log(requestArray)
    const toolbarStyles = theme => ({
      root: {
        paddingRight: theme.spacing(1)
      },
      highlight:
        theme.palette.type === "light"
          ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
          : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
      spacer: {
        flex: "1 1 100%"
      },
      actions: {
        color: theme.palette.text.secondary,
        display: "flex"
      },
      title: {
        flex: "0 0 auto"
      }
    });

    let EnhancedTableToolbar = props => {
      const { numSelected, classes, onApprove } = props;

      return (
        <Toolbar
          className={classNames(classes.root, {
            [classes.highlight]: numSelected > 0
          })}
        >
          <div className={classes.title}>
            {numSelected > 0 ? (
              <Typography color="inherit" variant="subheading">
                {numSelected} selected
              </Typography>
            ) : (
              <Typography variant="subheading" id="tableTitle">
              </Typography>
            )}
          </div>
          <div className={classes.spacer}/>
          <div className={classes.actions}>
            {numSelected > 0 ? (
              <Grid container>
                <Grid item xs={12}>
                  <IconButton aria-label="delete">
                    <DeleteIcon onClick={onApprove(event, selected)}/>
                  </IconButton>
                  <IconButton aria-label="approve">
                    <DoneIcon onClick={onApprove(event, selected)}/>
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list">
                  <FilterListIcon/>
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Toolbar>
      );
    };

    EnhancedTableToolbar.propTypes = {
      classes: PropTypes.object.isRequired,
      numSelected: PropTypes.number.isRequired
    };

    EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);


    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onApprove={onApprove}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={requestArray.length}
            />
            <TableBody>
              {stableSort(requestArray, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n._id);
                  return (
                    <TableRow
                      hover
                      //   onClick={event => this.handleEnableEdition (event, n._id)} // click to make each row editable instead of being checked
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n._id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected}
                                  onClick={event => this.handleClick(n._id)}/>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell align="right">{n.frontend.React}</TableCell>
                      <TableCell align="right">{n.backend.chsharp}</TableCell>
                      <TableCell align="right">{n.data.sql}</TableCell>
                      <TableCell align="right">{n.createdAt.toString().substring(0, 16)}</TableCell>
                    </TableRow>

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
          count={requestArray.length}
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

RequestForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RequestForm);
