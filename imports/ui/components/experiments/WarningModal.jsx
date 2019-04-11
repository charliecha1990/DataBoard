import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

const styles = theme => ({
  card: {
    maxWidth: 240,
    marginTop: theme.spacing.unit,
    margin: theme.spacing.unit,
    minWidth: 240
  },
  media: {
    height: 140,
    display: "flex",
    objectFit: "cover"
  },
  avatar: {
    margin: 5,
    width: 60,
    height: 60
  },
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  }
});

function rand() {
  return Math.round(0.5 * 20) - 10;
}

function getModalStyle() {
  const top = 40 + rand();
  const left = 40 + rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const WarningModal = props => {
  const {
    classes,
    onDeleteDataSet,
    id,
    openWarning,
    onCloseWarning
  } = props;

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={openWarning}
      onClose={this.handle}
    >
      <div style={getModalStyle()} className={classes.paper}>
        <Typography variant="title" id="modal-title">
          Delete this data Set?
        </Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            onCloseWarning();
            onDeleteDataSet({ id });
          }}
        >
          Yes
        </Button>
        <Button size="small" color="primary" onClick={onCloseWarning}>
          No
        </Button>
      </div>
    </Modal>
  );
};

export default withStyles(styles)(WarningModal);
