import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';


class EnhancedTableHead extends React.Component {
  constructor(props){
    super(props);
    // console.log(props.data);
  }
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  state = {
    selected:[],
    data: []
  };

  componentDidMount() {
    this.setState({data:this.props.data})
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState({ selected: this.props.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };
  
  render() {
    const { order, orderBy, rowCount, rows,  onEnableEdit } = this.props;
    const numSelected = this.state.selected.length;

    console.log(rows)
    return (
      
      <TableHead>
        <TableRow> 
          <TableCell padding="none">
            <Button  onClick={onEnableEdit} color="secondary">
              <Edit 
                style={{marginLeft: 8}}
                // onClick={editable=true}
              /> 
            </Button>
            {/* <Checkbox
              style={{marginLeft: 8}}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={this.state.selected.length === rowCount}
              onChange={this.handleSelectAllClick}/> */}
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? row.align||"right" : row.align||"left"}
                // align="right"
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
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}



export default EnhancedTableHead;