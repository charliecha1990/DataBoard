import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

moment().format("dddd, MMMM Do YYYY, h:mm:ss a")



myEventsList = [{
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

class Calendar = React.PureComponent {

    return (
        <div>
          <BigCalendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
          />
        </div>
    )
}

export default Calendar;