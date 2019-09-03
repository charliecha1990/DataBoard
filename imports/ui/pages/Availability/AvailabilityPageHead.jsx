import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { Component } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class AvailabilityPageHead extends Component {
  state = {
    data:[]
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  componentDidMount() {
    this.setState({data:this.props.data});
  }
  render() {
    const { order, orderBy, rowCount,rows } = this.props;
    const numericAlign = this.props.align || "left";
    const nonNumericAlign = this.props.align || "right";
    return (
      <TableHead>
        <TableRow>
          {rows.map(row => (
            <TableCell
              key={row.id}
              align={row.numeric ? numericAlign : nonNumericAlign}
              padding={row.disablePadding ? "none" : "default"}
              sortDirection={orderBy === row.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={this.createSortHandler(row.id)}
              >
                {row.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

export default AvailabilityPageHead;