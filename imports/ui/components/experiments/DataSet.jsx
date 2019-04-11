import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";

import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import { compose } from "recompose";

import WarningModal from "./WarningModal";

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

class DataSet extends React.Component {
  state = {
    open: false,
    newName: "",
    description: "",
    checked: false,
    openWarning: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCloseWarning = () => {
    this.setState({ openWarning: false });
  };

  onDataSetNameChange = event => {
    event.preventDefault();
    this.setState({ newName: event.target.value });
  };

  onDataSetDescriptionChange = event => {
    event.preventDefault();
    this.setState({ newDescription: event.target.value });
  };

  check = (params = {}) => {
    if (_.isEmpty(params.newName) || _.isEmpty(params.newDescription)) {
      this.props.pushMessage("Please entre the name and description");
    } else if (params.newName.length > 20 || params.newDescription > 50) {
      this.props.pushMessage("The name or description is too long");
    } else {
      this.setState({ checked: true });
      this.props.pushMessage("Data Set Fields Saved");
    }
  };

  render() {
    const {
      classes,
      URLs,
      createdAt,
      onDataSetClick,
      index,
      selected,
      name,
      onSaveModal,
      id,
      description,
      onDeleteDataSet
    } = this.props;

    const { newName, newDescription, checked } = this.state;

    const date = String(createdAt).substring(0, 25);

    return (
      <Card className={classes.card}>
        <CardActionArea
          onClick={onDataSetClick(index)}
          style={{ backgroundColor: selected ? "gainsboro" : null }}
        >
          <CardMedia
            className={classes.media}
            src="null"
            component="img"
            image={URLs[0]}
          >
            {/* {URLs.map((element, index) =>
            <Avatar
              key={index}
              src={element}
              className={classes.avatar} />
          )} */
            }
          </CardMedia>
          <CardContent>
            <Typography variant="caption" gutterBottom align="left">
              Name: {name}
            </Typography>
            <Typography variant="caption" gutterBottom align="left">
              Date: {date}
            </Typography>
            <Typography variant="caption" gutterBottom align="left">
              URL Amount: {URLs.length}
            </Typography>
            <Typography variant="caption" gutterBottom align="left">
              Description: {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={this.handleOpen}>
            Edit
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => this.setState({ openWarning: true })}
          >
            Delete
          </Button>
          <div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.open}
              onClose={this.handleClose}
            >
              <div style={getModalStyle()} className={classes.paper}>
                <Typography variant="caption" id="modal-title">
                  Name
                </Typography>
                <TextField
                  value={newName}
                  placeholder={name}
                  onChange={this.onDataSetNameChange}
                />
                <Typography variant="caption" id="modal-title">
                  Description
                </Typography>
                <TextField
                  value={newDescription}
                  placeholder={description}
                  onChange={this.onDataSetDescriptionChange}
                />
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    this.check({ newName, newDescription });
                    if (checked) {
                      this.setState({ open: false });
                      onSaveModal({ id, newName, newDescription });
                    } else {
                      this.setState({ open: true });
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </Modal>
            {this.state.openWarning &&
              <WarningModal
                id={id}
                onDeleteDataSet={onDeleteDataSet}
                openWarning={this.state.openWarning}
                onCloseWarning={this.handleCloseWarning}
              />}
          </div>
        </CardActions>
      </Card>
    );
  }
}

export default compose(withMessageContext, withStyles(styles))(DataSet);
