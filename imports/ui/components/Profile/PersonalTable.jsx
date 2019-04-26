import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';


import ChipArray from './ChipArray';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
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
  
      this.state = {
        practitioner: String,
        frontEnd: String,
        backEnd: String,
        data: String
      }
    }

    handleChange = (field, event) => {
      this.setState({
        [field]: event.target.value
      })
    }
    
    render() {
      const { classes } = this.props;
      const { practitioner, frontEnd, backEnd, data } = this.state;

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
                    <TextField
                    id="practitioner"
                    className={classes.textField}
                    value={practitioner}
                    onChange={()=>this.handleChange('practitioner',event)}
                    margin="normal"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ChipArray />
                    {/* <TextField
                      id="frontEnd"
                      className={classes.textField}
                      value={frontEnd}
                      onChange={()=>this.handleChange('frontEnd',event)}
                      margin="normal"
                      /> */}
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      id="textField"
                      className={classes.textField}
                      value={backEnd}
                      onChange={()=>this.handleChange('backEnd',event)}
                      margin="normal"
                      />
                    </TableCell>
                    <TableCell align="center"vvvvvv>
                      <TextField
                        id="data"
                        className={classes.textField}
                        value={data}
                        onChange={()=>this.handleChange('data',event)}
                        margin="normal"
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </Paper>
      );
    }
}

export default withStyles(styles)(PersonalTable);
