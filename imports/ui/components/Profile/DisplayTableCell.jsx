import React, { Component } from "react";
import TableCell from "@material-ui/core/TableCell"


class DisplayTableCell extends Component {
  render() {
    const {cellValue,align} =this.props;
    return (
      <TableCell align={align}>{cellValue}</TableCell>
    );
  }
}

export default DisplayTableCell;