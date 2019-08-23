import React, { Component } from "react";
import TableRow from "@material-ui/core/TableRow";
import DisplayTableCell from "./DisplayTableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";


class DisplayRow extends Component {

  state = {
    selected:[]
  };

  handleClick = (event, id) => {
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

  isSelected = id=> this.state.selected.indexOf(id)!==-1;
  render() {
    const { row,align } = this.props;
    // console.log(row);
    const selected = this.isSelected(row.id);
    const keys = Object.keys(row).filter(key => key !== "id");
    return (
      <TableRow hover role="checkbox" aria-checked={selected} key={row.key} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected}
                    onClick={event => this.handleClick(event, row.id)}/>
        </TableCell>
        {keys.map(key=> (
          <DisplayTableCell key={key} cellValue={row[key]} align={align || "center"}/>
        ))}
      </TableRow>


    )
      ;
  }
}

export default DisplayRow;
