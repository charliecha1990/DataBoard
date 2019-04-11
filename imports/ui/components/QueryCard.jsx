import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Fade from '@material-ui/core/Fade';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit,
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  container: {
    padding: theme.spacing.unit * 2,
  },
  dark: {
    background: theme.palette.secondary.dark,
  },
  inverted: {
    color: theme.palette.secondary.contrastText
  },
  editIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 30,
  }
});

class QueryCard extends React.Component {
  state = {
    hovering: false,
  }

  hovering = () => this.setState({ hovering: true });

  notHovering = () => this.setState({ hovering: false });

  handleSelect = (ev) => {
    ev.preventDefault();
    this.props.handleSelect(this.props.query._id);
  }

  handleDelete = (ev) => {
    ev.stopPropagation();
    this.props.handleDelete(this.props.query._id);
  }

  render() {
    const { query, classes, className: classNameProp, ...props } = this.props;
    const { name, description } = query;
    return (
      <Paper
        onClick={this.handleSelect}
        onMouseOver={this.hovering}
        onMouseOut={this.notHovering}
        className={classNames(classes.paper, { [classes.dark]: this.state.hovering }, classNameProp)}>
        <Grid className={classes.container} container justify="space-between" alignItems="center">
          <Grid item xs={8}>
            <Typography variant="subheading" className={classNames({ [classes.inverted]: this.state.hovering })}>
              { name || description || false }
            </Typography>
          </Grid>
          <Grid item xs={2} sm={1}>
            <IconButton color="secondary" onClick={this.handleDelete}><DeleteIcon /></IconButton>
          </Grid>
          <Fade in={this.state.hovering} className={classNames(classes.editIcon, classes.inverted)}>
            <EditIcon />
          </Fade>
        </Grid>
      </Paper>
    );
  }
};

export default withStyles(styles)(QueryCard);
