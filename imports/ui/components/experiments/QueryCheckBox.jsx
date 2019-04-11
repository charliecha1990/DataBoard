import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    display: 'flex',
    fontSize: "small"
  }
});

class QueryCheckBox extends React.Component {

  render() {
    const { classes, imageSegmentation, imageFeatures, onCheck, isLoading } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          {/* <FormLabel component="legend">Select the image features</FormLabel> */}
          <FormGroup row={true}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={imageSegmentation}
                  onChange={onCheck('imageSegmentation')}
                  value="imageSegmentation"
                  disabled={isLoading}
                />
              }
              label="Segmentation"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={imageFeatures}
                  onChange={onCheck('imageFeatures')}
                  value="imageFeatures"
                  disabled={isLoading}
                />
              }
              label="Features"
            />
          </FormGroup>
          {/* <FormHelperText>Select the features</FormHelperText> */}
        </FormControl>
      </div>
    );
  }
}

QueryCheckBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryCheckBox);