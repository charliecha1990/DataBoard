import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import withSession from '/imports/ui/helpers/withSession';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import { compose } from 'recompose';

import BrandBar from './BrandBar';

import TablePaginationActions from '../TablePaginationActions';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  brandChart: {
    minHeight: 200
  },
  tableRow: {
    '&:hover': {
      cursor: 'pointer',
      background: '#eee'
    }
  }
});

const COLUMNS = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Brand' },
  { id: 'numProducts', numeric: true, disablePadding: false, label: '# Products' },
  { id: 'markdowns', numeric: true, disablePadding: false, label: 'Markdowns' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {COLUMNS.map(column =>
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
          )}
        </TableRow>
      </TableHead>
    );
  }
}

class Brands extends React.Component {
  componentDidMount() {
    this.props.resetSession();
  }

  handleChangePage = (event, page) => {
    this.props.setSession({ page });
  }

  handleChangeRowsPerPage = event => {
    this.props.setSession({ rowsPerPage: event.target.value });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.props.session.orderBy === property && this.props.session.order === 'desc') {
      order = 'asc';
    }

    this.props.setSession({ order, orderBy, page: 0 });
  };

  render() {
    const { brands, handleSelect, width, session, classes, ...props } = this.props;
    const { rowsPerPage, page, order, orderBy } = session;
    const brandCount = brands.length;

    let displayBrands =
      order === 'desc'
        ? brands.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : brands.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    displayBrands = displayBrands.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, brandCount - page * rowsPerPage);

    const padding = isWidthUp('md', width) ? 'default' : 'dense';

    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} className={classes.brandChart}>
          <BrandBar brands={displayBrands} handleSelect={handleSelect} />
        </Grid>
        <Grid item xs={12}>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={brands.length}
            />
            <TableBody>
              {displayBrands.map(({name, numProducts, markdowns, avgSellout}) => (
                  <TableRow key={name} className={classes.tableRow} onClick={() => handleSelect(name)}>
                    <TableCell padding={padding}>{name}</TableCell>
                    <TableCell padding={padding} numeric>{ numProducts || '-' }</TableCell>
                    <TableCell padding={padding} numeric>{ markdowns && (markdowns.toLocaleString({ style: 'percent' }) + '%') || '-' }</TableCell>
                  </TableRow>
              ))}
              {Array(emptyRows).fill(0).map((_r, idx) => <TableRow key={idx} />)}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                    colSpan={3}
                    count={brandCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
            </TableFooter>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default
compose(
  withSession('brandDisplayOptions', {
    page: 0,
    rowsPerPage: 5,
    orderBy: 'numProducts',
    order: 'desc'
  }),
  withWidth({resizeInterval: 40}),
  withStyles(styles)
)(Brands);
