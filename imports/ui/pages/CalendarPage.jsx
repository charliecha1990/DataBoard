import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from "@material-ui/core/Grid";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router";

import Dnd from '../components/calendar/BigCalendar';
import EventModal from '../components/calendar/EventModal';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    // display: 'center'
  },
  button: {
    margin: theme.spacing(1),
  },
});

class CalendarPage extends React.Component {
  constructor (props,context) {
    super(props);
    this.state = {
      open: false
    }

    this.backToHome = this.backToHome.bind(this);
  }

  backToHome () {
    console.log(this.props)
    this.props.history.push('/');
  }

  render() {
    const localizer = momentLocalizer(moment)
    const { classes, ...props } = this.props;

    return (
        <Grid 
          container 
          justify="center" 
          className={classes.root}
        >
          <Grid item xs={10}>
            <Button onClick={this.backToHome} color="secondary" variant="contained" className={classes.button}>
              Home
            </Button>
            <Dnd onChange={this.handleChange} open={this.handleOpen} localizer={localizer}/>
            {/* <EventModal 
              open={this.state.open}
              onClose={this.handleClose}
            /> */}
         
          </Grid>
        </Grid>  
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(CalendarPage))