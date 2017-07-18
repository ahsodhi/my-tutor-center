import React, { Component } from 'react';
import update from 'immutability-helper';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {calendarView:'week', currentDate: new Date(Date.now())};
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.events) {
      this.findMinDate(nextProps.events);
    }
  }
  findMinDate(events) {
    if (this.state.selectedEvent) {
      this.setState(update(this.state,{currentDate:{$set: this.state.selectedEvent.start}}));
    }
    else if (events.length > 0) {
      var minDate = events[0].start;
      events.forEach(event => {
        if (event.start <= minDate) {
          minDate = new Date(event.start);
        }
      });
      this.setState(update(this.state,{currentDate:{$set:minDate}}));
    }
    else {
      this.setState(update(this.state,{currentDate:{$set:new Date(Date.now())}}));
    }
  }
  render() {
    return (
      <BigCalendar events={this.props.events} view={this.state.calendarView}
        onView={v => {this.setState(update(this.state, {calendarView: {$set: v}}));}}
        eventPropGetter={this.props.eventPropGetter}
        onSelectEvent={event => {
          this.setState(update(this.state,{selectedEvent:{$set: event}}),() => {this.props.onSelectEvent(event);});
        }}
        date={this.state.currentDate}
        onNavigate={date => {this.setState(update(this.state,{currentDate:{$set: date}}));}}
        scrollToTime={this.state.currentDate}
      />
    );
  }
}

export default Calendar;
