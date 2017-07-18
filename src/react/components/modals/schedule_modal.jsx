import React, { Component } from 'react';
import update from 'immutability-helper';
import Modal from 'react-modal'
import moment from 'moment';

import ModalStyles from './modal_styles';
import TimeSlot from '../timeslot.jsx';

class ScheduleModal extends Component {
  constructor(props) {
    super(props);
    var date = new Date(Date.now());
    this.state = {data: {days:[],start:date,end:date,dates:{}}, modal: false };
  }
  renderWeekDays() {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const html = days.map((day,i) =>
        <div key={i}>
          {day} <input type='checkbox' value={i} checked={this.state.data.days.indexOf(i) != -1}
           onChange={e => {
            if (e.target.checked && this.state.data.days.indexOf(i) == -1)
              this.setState(update(this.state, {data: {days: {$push: [i]}}}));
            else if (!e.target.checked && this.state.data.days.indexOf(i) != -1)
              this.setState(update(this.state, {data: {days: {$set: this.state.data.days.filter(v => v != i)}}}));
           }} />
        </div>
    );
    return html;
  }
  renderTimeSlots() {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const html = this.state.data.days.map((day,i) => {
      return (
        <div key={i} className='slot'>
            {days[day]}
            <TimeSlot day={day} onChange={this.updateDates.bind(this)}
              defaultStart={moment()} defaultEnd={moment()}
            />
        </div>
      );
    });
    return html;
  }
  updateDates(day, val, key) {
    let {dates} = this.state.data;
    dates[day] = dates[day] ? dates[day] : {};
    dates[day][key] = val;
    this.setState(update(this.state,{data:{dates:{$set: dates}}}));
  }
  getEvents() {
    const {dates} = this.state.data;
    let events = [];
    Object.keys(dates).forEach(k => {
      let dateStart = new Date(dates[k].start);
      let dateEnd = new Date(dates[k].end);
      let key = 0;
      while (dateStart <= this.state.data.end && dateEnd <= this.state.data.end) {
        if (dateStart >= this.state.data.start && dateEnd >= this.state.data.start) {
          let newDateStart = new Date(dateStart);
          let newDateEnd = new Date(dateEnd);
          events.push({start:newDateStart,end:newDateEnd,key:key});
        }
        dateStart.setDate(dateStart.getDate() + 7);
        dateEnd.setDate(dateEnd.getDate() + 7);
        key += 1;
      }
    });
    this.props.onSave(events);
    this.setState(update(this.state,{modal:{$set: false}}));
  }
  toggle() {
    this.setState(update(this.state,{modal:{$set: true}}));
  }
  render() {
    return (
      <Modal
        isOpen={this.state.modal}
        style={ModalStyles}
        contentLabel='Update Schedule'
      >
        <div>
          <h3>Set Up {this.props.scheduleFor} Schedule</h3>
          <div className='inline-form'>
            <span className='lbl'>Start:</span>
            <input style={{marginRight:'50px'}} type='date' onChange={e => {
              const date = new Date(Date.parse(e.target.value));
              date.setDate(date.getDate() + 1);
              this.setState(update(this.state,{data:{start:{$set: date}}}));
            }} />
            <span className='lbl'>End:</span>
            <input type='date' onChange={e => {
              const date = new Date(Date.parse(e.target.value));
              date.setDate(date.getDate() + 1);
              this.setState(update(this.state,{data:{end:{$set: date}}}));
            }} />
          </div>
          <div className='checkboxes'>
            {this.renderWeekDays()}
          </div>
          <div className='time-slots'>
            {this.renderTimeSlots()}
          </div>
          <div className='inline-form'>
          {
            Object.keys(this.state.data.dates).length >= 1 ?
            <button className='btn btn-info' onClick={this.getEvents.bind(this)}>Save Schedule</button> : undefined
          }&nbsp;
          <button className='btn btn-danger' onClick={() => {this.setState(update(this.state,{modal:{$set: false}}));}}>Close</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ScheduleModal;
