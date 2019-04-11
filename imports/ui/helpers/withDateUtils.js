import React from 'react';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

export default Component =>
  class WithDateUtils extends Component {
    render() {
      return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
          { super.render() }
        </MuiPickersUtilsProvider>
      );
    }
  }
