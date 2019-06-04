import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import _ from 'lodash';

import ChipArray from './ChipArray';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
  head: {
    // backgroundColor: theme.palette.secondary.main,
    // color:'white'
  },
  textField: {
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


class PersonalTable extends React.Component {
    constructor(props) {
      super(props);
  
    }
    
    render() {
      const { classes, name, frontEndLevel, backEndLevel, dataLevel} = this.props;
      
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead className={classes.head}> 
              <TableRow>
                <TableCell variant="head" align="center">Practitioner</TableCell>
                <TableCell variant="head" align="center">Front-end</TableCell>
                <TableCell variant="head" align="center">Back-end</TableCell>
                <TableCell variant="head" align="center">Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>            
                <TableRow>
                  <TableCell align="center">
                    {/* <TextField
                    id="practitioner"
                    InputProps={{
                      disableUnderline: true,
                     }}
                    className={classes.textField}
                    value={name}
                    margin="normal"
                    /> */}
                    {name}
                  </TableCell>
                  <TableCell align="center">
                    {/* <ChipArray /> */}
                    {/* <TextField
                      id="frontEnd"
                      InputProps={{
                        disableUnderline: true,
                       }}
                      className={classes.textField}
                      value={frontEndLevel}
                      margin="normal"
                      />  */}
                    {frontEndLevel}
                  </TableCell>
                  <TableCell align="center">
                    {/* <TextField
                      id="textField"
                      InputProps={{
                        disableUnderline: true,
                       }}
                      className={classes.textField}
                      value={backEndLevel}
                      margin="normal"
                      /> */}
                      {backEndLevel}
                    </TableCell>
                    <TableCell align="center">
                      {/* <TextField
                        id="data"
                        InputProps={{
                          disableUnderline: true,
                         }}
                        className={classes.textField}
                        value={dataLevel}
                        margin="normal"
                        /> */}
                        {dataLevel}
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </Paper>
      );
    }
}

export default withStyles(styles)(PersonalTable);
