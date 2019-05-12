import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { TextField } from "@material-ui/core";
//import { Add } from "@material-ui/icons";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 160
  }
});
class DialogSelect extends React.Component {
  // state = { backEndLevel: "", frontEndLevel: "", dataLevel: "" };
  
  render() {
    const {
      classes,
      open,
      onSubmit,
      onClose,
      practitionerData,
      onChange, // on number change
      onNameChange // on practitioner's name change
    } = this.props;

    return (
      <div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={open}
          onClose={onClose}
        >
          <DialogTitle>Enter Name and Skill Level</DialogTitle>
          <DialogContent>
            <form className={classes.container}>
              <FormControl className={classes.formControl}>
                {/* <InputLabel htmlFor="age-native-simple">Name</InputLabel> */}
                <TextField
                  id="practitioner"
                  className={classes.textField}
                  value={practitionerData.name}
                  onChange={onNameChange}
                  margin="normal"
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel disableAnimation='true' htmlFor="front-end">Front-end</InputLabel>
                <Select
                  native
                  value={practitionerData.frontEndLevel}
                  onChange={onChange("frontEndLevel")}
                  input={<Input id="front-end" />}
                >
                  <option value="" />
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="back-end">Back-end</InputLabel>
                <Select
                  native
                  value={practitionerData.backEndLevel}
                  onChange={onChange("backEndLevel")}
                  input={<Input name='back-end' id="back-end" />}
                >
                  <option value="" />
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="data">Data</InputLabel>
                <Select
                  native
                  value={practitionerData.dataLevel}
                  onChange={onChange("dataLevel")}
                  input={<Input id="data" />}
                >
                  <option value="" />
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={onSubmit} color="secondary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DialogSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DialogSelect);
