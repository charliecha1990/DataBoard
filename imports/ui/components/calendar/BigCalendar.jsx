import React from 'react'
import events from './Event'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventModal from './EventModal'
import Grid from "@material-ui/core/Grid";

const DragAndDropCalendar = withDragAndDrop(Calendar)

class Dnd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: events,
      title: '',
      start: Date,
      end: Date
    }

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })

    alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
      open: false
    })

    alert(`${event.title} was resized to ${start}-${end}`)
  }

  newEvent(event) { 

    this.setState({
        open: true
      })

    // const title = window.prompt('New Event name')
    let idList = this.state.events.map(a => a.id)
    let newId = Math.max(...idList) + 1
    let hour = {
      id: newId,
      title: title,
      allDay: event.slots.length == 1,
      start: event.start,
      end: event.end,
    }
    this.setState({
      events: this.state.events.concat([hour]),
    })
  }

  /********************Event Handler for EventModal****************************/

  handleClose () {
    this.setState({
        open: false
    })
  }

  handleOpen () {
    this.setState({
      open: false
    })
  }

  handleSubmit () {

  }

  handleChange = (field, event) => {
    this.setState({ [field]: event.target.value });
  };

  /********************Event Handler for EventModal****************************/

  render() {
    const { ...props } = this.props;

    return (
        <Grid style={{ width: '100%', height: '100%' }} container justify="center" >
            <Grid item xs={12}>  
                <DragAndDropCalendar
                  selectable
                  localizer={this.props.localizer}
                  events={this.state.events}
                  onEventDrop={this.moveEvent}
                  resizable
                  onEventResize={this.resizeEvent}
                  onSelectSlot={this.newEvent}
                  onDragStart={console.log}
                  defaultView={Views.MONTH}
                  defaultDate={new Date()}
                />
                <EventModal   
                  onClose={this.handleClose} 
                  open={this.state.open}
                  onSubmit={this.handleSubmit}
                  onChange={this.handleChange}
                  event={this.state}
                />
            </Grid>
         </Grid>
    )
  }
}

export default Dnd