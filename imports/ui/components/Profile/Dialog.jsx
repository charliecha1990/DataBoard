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
import MenuItem from "@material-ui/core/MenuItem";
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
    minWidth: 120
  }
});
class DialogSelect extends React.Component {


  render() {
    const { classes, open, onSubmit, onClose, practitionerData, onSelect, onNameChange} = this.props;

    return (
      <div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={open}
          onClose={onClose}
        >
          <DialogTitle>Enter Skill Level</DialogTitle>
          <DialogContent>
            <form className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Name</InputLabel>
                  <TextField
                    id="practitioner"
                    className={classes.textField}
                    value={practitionerData.name}
                    onChange={()=> onNameChange(event)}
                    margin="normal"
                    />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Front-end</InputLabel>
                <Select
                  native
                  value={practitionerData.frontEnd}
                  onChange={()=> onSelect("frontEnd",event)}
                  input={<Input id="age-native-simple" />}
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
                <InputLabel htmlFor="age-simple">Back-tend</InputLabel>
                <Select
                  value={practitionerData.backEnd}
                  onChange={()=> onSelect("backEnd",event)}
                  input={<Input id="age-simple" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Data</InputLabel>
                <Select
                  value={practitionerData.data}
                  onChange={()=> onSelect("data",event)}
                  input={<Input id="age-simple" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={onSubmit}color="secondary">
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
