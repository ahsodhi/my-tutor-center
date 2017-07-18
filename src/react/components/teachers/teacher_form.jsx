import React, { Component } from 'react';
import update from 'immutability-helper';

import GetRequest from '../../utils/get_request';
import { ScheduleModal } from '../modals';
import Calendar from '../calendar.jsx';
import EditEvent from '../edit_event.jsx';

class TeacherForm extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      subjects: [],
      notes: '',
      wage: 0,
      wagePeriod: 0, // 0 = per hour, 1 = per week, 2 = per month, 3 = per year,
      events: []
    }, subjects: []};
  }
  componentDidMount() {
    GetRequest('/api/subjects', (response) => {
      this.setState(update(this.state, {subjects: {$set: response.data}}));
    });
    if (this.props.id) {
      GetRequest('/api/teachers/' + this.props.id, (response) => {
        if (response.success) {
          response.data.events.forEach((event,i) => {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
            event.key = i;
          });
          this.setState(update(this.state, {data: {$set: response.data }}));
        }
      });
    }
  }
  getFormData() {
    return this.state.data;
  }
  updateTeacher(field, value, flag=false) {
    var teacher = this.state.data;
    if (flag) { value = parseFloat(value); }
    teacher[field] = value;
    this.setState(update(this.state, {data: {$set: teacher}}));
  }
  updateTeacherSubjects(selected, value) {
    const {subjects}  = this.state.data;
    if (selected && subjects.indexOf(value) == -1) {
      var newState = update(this.state, {data: {subjects: {$push: [value]}}});
      this.setState(newState);
    }
    else if (!selected && subjects.indexOf(value) != -1) {
      var newSubjects = subjects.filter(v => v != value);
      var newState = update(this.state, {data: {subjects: {$set: newSubjects}}});
      this.setState(newState);
    }
  }
  renderSubjects() {
    const html = this.state.subjects.map((subject, i) => {
      return (
        <option key={i} selected={this.state.data.subjects.indexOf(subject._id) != -1} value={subject._id}>
          {subject.name}
        </option>
      );
    });
    return html;
  }
  onScheduleSave(events) {
    let newState = this.state;
    newState = update(newState,{data:{events:{$set: events}}});
    this.setState(newState);
  }
  renderEditEvent() {
    const {selectedEvent} = this.state;
    const html = selectedEvent ?
      <EditEvent event={selectedEvent}
        onSave={newEvent => {
          const {events} = this.state.data;
          const index = events.findIndex(e => e.key == newEvent.key);
          events[index] = newEvent;
          let newState = update(this.state,{data:{events:{$set: events}}})
          newState = update(this.state,{selectedEvent:{$set: null}});
          this.setState(newState);
        }}
      /> :
      null;
    return html;
  }
  render() {
    const t = this.state.data;
    return (
      <div className='form-container'>
        <ScheduleModal onSave={this.onScheduleSave.bind(this)} scheduleFor='Teacher' ref='scheduleModal' />
        <div className='form'>
          <div className='form-group'>
            <input type='text' className='form-control' placeholder='First Name' value={t.firstName}
              onChange={(e) => { this.updateTeacher.call(this, 'firstName', e.target.value )}}
            />
            <input type='text' className='form-control' placeholder='Last Name' value={t.lastName}
              onChange={(e) => { this.updateTeacher.call(this, 'lastName', e.target.value )}}
            />
            <input type='text' className='form-control' placeholder='Email' value={t.email}
              onChange={(e) => { this.updateTeacher.call(this, 'email', e.target.value )}}
            />
            <input type='text' className='form-control' placeholder='Phone' value={t.phone}
              onChange={(e) => { this.updateTeacher.call(this, 'phone', e.target.value )}}
            />
            <input type='text' className='form-control' placeholder='Address' value={t.address}
              onChange={(e) => { this.updateTeacher.call(this, 'address', e.target.value )}}
            />
            <div className='input-group'>
              <span className='input-group-addon'>$</span>
              <input type='number' step='0.01' className='form-control' placeholder='Wage' value={t.wage}
                onChange={(e) => { this.updateTeacher.call(this, 'wage', e.target.value, true); }}
              />
            </div>
            <select className='form-control' value={t.wagePeriod}
              onChange={(e) => { this.updateTeacher.call(this, 'wagePeriod', e.target.value, true); }}
            >
              <option value='' selected disabled>Wage Period</option>
              <option value='0'>Hourly</option>
              <option value='1'>Weekly</option>
              <option value='2'>Monthly</option>
              <option value='3'>Yearly</option>
            </select>
            <select multiple className='form-control' onChange={e => {
              const elems = e.target.children;
              for (var i = 0; i < elems.length; i++) {
                this.updateTeacherSubjects(elems[i].selected, elems[i].value);
              }
            }}>
              <option style={{textAlign:'right'}} disabled>Subjects</option>
              {this.renderSubjects()}
            </select>
          </div>
          <div className='form-group'>
            {this.renderEditEvent()}
          </div>
        </div>
        <div className='form3'>
          <div className='form-group'>
            <button className='btn btn-info'
              onClick={() => {this.refs.scheduleModal.toggle()}}
            >
            Create New Teacher Schedule
            </button>
          </div>
          <Calendar events={this.state.data.events}
            onSelectEvent={event => {this.setState(update(this.state,{selectedEvent:{$set: event}}));}}
          />
        </div>
      </div>
    );
  }
}

export default TeacherForm;
