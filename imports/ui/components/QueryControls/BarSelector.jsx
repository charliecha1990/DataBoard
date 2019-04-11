import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { BOTTOM_NAV_HEIGHT, STACKING_BAR_HEIGHT } from '/imports/ui/helpers/constants';

import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';

import CloseIcon from '@material-ui/icons/Close';

const ELIDE_BREAKPOINT = 'xs';

const styles = theme => ({
  badge: {
    transform: 'scale(0.6)',
  },
  button: {
    border: '1px solid rgba(0,0,0,0.12)',
    padding: '4px 8px',
  },
  buttonLabel: {
    textTransform: 'none',
    fontWeight: 'normal',
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    color: 'rgba(0, 0, 0, 0.5)',
    '&:hover': {
      color: 'rgba(0, 0, 0, 1)',
      cursor: 'pointer',
    },
    transition: theme.transitions.create('color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  fillScreen: {
    // height: `calc(100vh - ${STACKING_BAR_HEIGHT}px - ${BOTTOM_NAV_HEIGHT}px)`,
    width: '100vw',
  },
  popover: {
    padding: theme.spacing.unit * 4,
    overflow: 'visible',
  },
  popoverContainer: {
    height: '100%',
    width: '100%',
  },
});

const BadgeDecorator = ({children, content, decorate = false, ...props}) => (
  decorate ? (
    <Badge badgeContent="" color="secondary" {...props}>
      { children }
    </Badge>
  ) : children
);

class BarSelector extends React.Component {
  state = {
    buttonNode: null
  }

  handleClickButton = () => {
    this.setState({
      buttonNode: findDOMNode(this.button),
    }, this.props.handleClick);
  }

  render() {
    const {classes, active, title, width, onChange, onClose, open, children, ...props} = this.props;
    const mobile = isWidthDown(ELIDE_BREAKPOINT, width);
    const anchorOrigin = { vertical: 'bottom', horizontal: 'center'};
    const transformOrigin = { vertical: 'top', horizontal: 'center' };
    const anchorReference = mobile ? 'anchorPosition' : 'anchorEl';

    return (
      <Grid item className={classes.gridItem}>
        <BadgeDecorator classes={{ badge: classes.badge }} content="" decorate={active}>
          <Button ref={node => this.button = node}
            classes={{ root: classes.button, label: classes.buttonLabel }}
            disableRipple
            size="small"
            onClick={this.handleClickButton}>{ title }</Button>
        </BadgeDecorator>
        <Popover
          anchorReference={anchorReference}
          anchorEl={this.state.buttonNode}
          anchorPosition={{ top: STACKING_BAR_HEIGHT * 2, left: 0 }}
          open={open}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          onClose={onClose}
          classes={{ paper: classNames(classes.popover, { [classes.fillScreen]: mobile }) }}
          >
          <CloseIcon className={classes.closeIcon} onClick={onClose} />
          <Grid container
            direction="column"
            justify="center"
            alignItems="center"
            alignContent="center"
            className={classes.popoverContainer}>
            { children }
          </Grid>
        </Popover>
      </Grid>
    );
  }
}

export default withWidth({resizeInterval: 40})(withStyles(styles)(BarSelector));
