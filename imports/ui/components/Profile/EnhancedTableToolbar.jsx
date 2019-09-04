// import { lighten } from "@material-ui/core/styles/colorManipulator";
// import Toolbar from "@material-ui/core/Toolbar";
// import classNames from "classnames";
// import Typography from "@material-ui/core/Typography";
// import Tooltip from "@material-ui/core/Tooltip";
// import IconButton from "@material-ui/core/IconButton";
// import DeleteIcon from "@material-ui/core/SvgIcon/SvgIcon";
// import PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core";
// import React from "react";
// import FilterListIcon from "@material-ui/icons/FilterList";


// const toolbarStyles = theme => ({
//   root: {
//     paddingRight: theme.spacing(1)
//   },
//   highlight:
//     theme.palette.type === "light"
//       ? {
//         color: theme.palette.secondary.main,
//         backgroundColor: lighten(theme.palette.secondary.light, 0.85)
//       }
//       : {
//         color: theme.palette.text.primary,
//         backgroundColor: theme.palette.secondary.dark
//       },
//   spacer: {
//     flex: "1 1 100%"
//   },
//   actions: {
//     color: theme.palette.text.secondary
//   },
//   title: {
//     flex: "0 0 auto"
//   }
// });

// let EnhancedTableToolbar = props => {
//   const { numSelected, classes } = props;

//   return (
//     <Toolbar
//       className={classNames(classes.root, {
//         [classes.highlight]: numSelected > 0
//       })}
//     >
//       <div className={classes.spacer}/>
//     </Toolbar>
//   );
// };

// EnhancedTableToolbar.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(toolbarStyles)(EnhancedTableToolbar);