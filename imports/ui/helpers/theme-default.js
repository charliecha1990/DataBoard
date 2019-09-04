import { createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import { DRAWER_WIDTH } from './constants';
import { colors } from '@material-ui/core';

const white = '#FFFFFF';

const themeDefault = createMuiTheme({
  palette: {
    primary: {
      extraLight: '#B0FFEC',
      light: '#69ebff',
      main: '#ffffff',
      dark: '#0088a4',
      contrastText: '#000'
    },
    secondary: {
      light: '#AFF62F',
      main: '#86BC24',
      dark: '#73A21F',
      contrastText: '#fff',
    },
    error: {
      contrastText: white,
      dark: colors.red[900],
      main: colors.red[600],
      light: colors.red[400]
    },
    success: {
      contrastText: white,
      dark: colors.green[900],
      main: colors.green[600],
      light: colors.green[400]
    }
  },
  ripple: {
    color: 'blue'
  },
  // appBar: {
  //   maxHeight: 57,
  //   top: 0,
  //   position: 'fixed',
  //   color: blue600
  // },
  drawer: {
    width: DRAWER_WIDTH,
    // color: grey900
  },
  button: {
    primaryColor: blue[600],
  },
  overrides: {
    MuiCollapse: {
      entered: {
        height: "auto",
        overflow: "visible"
      }
    }
  }
});

export default themeDefault;
