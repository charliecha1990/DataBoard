/** Generic component for displaying Paper on a grid **/
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DramaticCollapse from '/imports/ui/components/DramaticCollapse';

const styles = theme => ({
  container: {
    height: '100% !important',
    overflow: 'hidden',
  },
  paper: {
    position: 'relative',
    padding: 24,
    // height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    // margin: theme.spacing.unit * 2,
  },
  itemContainer: {
    height: '100%',
    width: '100%',
  },
  title: {
    verticalAlign: 'center',
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      color: 'rgba(0, 0, 0, 0.5)',
      fontWeight: 300
    }
  }
})

class DisplayItem extends React.Component {
  render() {
    const { children, classes, show, title, titleIcon = null, paperClass, containerProps, ...props } = this.props;

    if (!show) { return <div />; }

    // const overflowClass = classNames({ [classes.allowOverflow]: this.state.in });

    return (
      <Grid item xs={12} {...props}>
        { title &&
            <div className={classes.title}>
              { titleIcon }
              <Typography variant="title">&nbsp; { title }</Typography>
            </div>
        }
        <Paper className={classNames(classes.paper, paperClass)}>
          { children }
        </Paper>
      </Grid>
    );
  }
};

DisplayItem.propTypes = {
  show: PropTypes.bool.isRequired,
  paperClass: PropTypes.string,
  containerProps: PropTypes.object
};

export default withStyles(styles)(DisplayItem);
