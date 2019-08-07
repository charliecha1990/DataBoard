import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
              color: theme.palette.secondary.main,
              backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
      display: 'flex'
    },
    title: {
      flex: '0 0 auto',
    },
  });

  let EnhancedTableToolbar = props => {
    const { numSelected, classes, onApprove, onReject, selected} = props;
  
    return (
        <Toolbar
            className={classNames(classes.root, {
              [classes.highlight]: numSelected > 0,
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
            <div className={classes.spacer} />
          <div className={classes.actions}>
            {numSelected > 0 ? (
                <Grid container>
                  <Grid item xs={12}>
                    <IconButton aria-label="delete">
                      <DeleteIcon onClick={()=> onReject(selected)}/>
                    </IconButton>
                    <IconButton aria-label="approve">
                      <DoneIcon onClick={()=> onApprove(selected)}/>
                    </IconButton>
                  </Grid>
                </Grid>
            ) : (
                <Tooltip title="Filter list">
                  <IconButton aria-label="Filter list">
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
            )}
          </div>
        </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
  };
  
export default EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);
