import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React from 'react'
// import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
// import 'react-big-calendar/lib/sass/styles'
// import 'react-big-calendar/lib/sass/styles';

const localizer = momentLocalizer(moment)


const myEventsList = [{
    title: 'Eat',
    start: Date,
    end: Date,
    allDay: true,
    resource: 'no',
  },
  {
    title: 'Sleep',
    start: Date,
    end: Date,
    allDay: false,
    resource: 'team',
  }
]

const styles = theme => ({
    root: {
        width: 1000,
        width: 500
    }
  });

const CalendarPage = props => (
  <div style={{height: '100%'}, {width: '100%'}}> 
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
    />
  </div>
)

export default withStyles(styles, { withTheme: true })(CalendarPage)