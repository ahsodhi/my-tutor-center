import React, { Component } from 'react';
import update from 'immutability-helper';

import GetRequest from '../../utils/get_request';
import { ScheduleModal } from '../modals';
import Calendar from '../calendar.jsx';
import EditEvent from '../edit_event.jsx';

class ScheduleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {data:{
      student: '',
      teacher: '',
      pack: '',
      events: []
    },
    students:[],packs:[],teachers:[]};
  }
  componentDidMount() {
    GetRequest('/api/packages', (resPacks) => {
      this.setState(update(this.state, {packs: {$set: resPacks.data }}));
    });
    GetRequest('/api/teachers', (resTeachers) => {
      resTeachers.data.forEach(teacher => {
        teacher.events.forEach(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
      });
      this.setState(update(this.state, {teachers: {$set: resTeachers.data }}), () => {
        GetRequest('/api/clients', (resClients) => {
          var studs = [];
          resClients.data.forEach(client => {
            client.students.forEach(student => {
              studs.push(student);
            });
          });
          this.setState(update(this.state, {students: {$set: studs }}), () => {
            if (this.props.id) {
              GetRequest('/api/schedules/' + this.props.id, (resSchedule) => {
                var selectedTeacher = resTeachers.data.findIndex(teacher => teacher._id == resSchedule.data.teacher);
                var selectedStudent = studs.findIndex(stud => stud._id == resSchedule.data.student);
                var newState = update(this.state, {selectedTeacherIndex: {$set: selectedTeacher }});
                newState = update(newState, {selectedStudentIndex: {$set: selectedStudent}});
                resSchedule.data.events.forEach((event,i) => {
                  event.start = new Date(event.start);
                  event.end = new Date(event.end);
                  event.student = true;
                  event.key = i;
                });
                newState = update(newState, {data: {$set: resSchedule.data }});
                this.setState(newState);
              });
            }
          });
        });
      });
    });
  }
  getFormData() {
    return this.state.data;
  }
  updateSchedule(field, value, flag=false) {
    var schedule = this.state.data;
    if (flag) { value = parseInt(value); }
    schedule[field] = value;
    this.setState(update(this.state, {data: {$set: schedule}}));
  }
  renderPacks() {
    const {selectedStudentIndex} = this.state;
    const html = this.state.packs.map((pack, i) => {
      if (selectedStudentIndex >= 0 && this.state.students[selectedStudentIndex].packs.indexOf(pack._id) != -1) {
        return (
          <option key={i} value={pack._id}>{pack.name}</option>
        );
      }
    });
    return html;
  }
  renderStudents() {
    const html = this.state.students.map((student, i) => {
      return (
        <option key={i} value={student._id}>
          {student.firstName + ' ' + student.lastName}
        </option>
      );
    });
    return html;
  }
  renderTeachers() {
    const html = this.state.teachers.map((teacher, i) => {
      return (
        <option key={i} value={teacher._id}>
          {teacher.firstName + ' ' + teacher.lastName}
        </option>
      );
    });
    return html;
  }
  onScheduleSave(events) {
    events.forEach(event => {
      event.student = true;
    });
    let newState = this.state;
    newState = update(newState,{data:{events:{$set: events}}});
    this.setState(newState);
  }
  getCalendarEvents() {
    let calendarEvents = this.state.data.events.slice();
    const {selectedTeacherIndex,teachers} = this.state;
    if (selectedTeacherIndex >= 0) {
      teachers[selectedTeacherIndex].events.forEach(event => {
        calendarEvents.push(event);
      });
    }
    return calendarEvents;
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
    return (
      <div className='form-container'>
        <ScheduleModal onSave={this.onScheduleSave.bind(this)} scheduleFor='Student' ref='scheduleModal' />
        <div className='form'>
          <div className='form-group'>
            <select className='form-control'
              value={this.state.data.student}
              onChange={e => {
                this.updateSchedule('student', e.target.value);
                this.setState(update(this.state, {selectedStudentIndex: {$set: parseInt(e.target.selectedIndex)-1}}));
              }}
            >
              <option disabled selected>Student</option>
              {this.renderStudents()}
            </select>
            <select className='form-control'
              value={this.state.data.pack}
              onChange={e => {
                this.updateSchedule('pack', e.target.value);
                this.setState(update(this.state, {selectedPackIndex: {$set: parseInt(e.target.selectedIndex)-1}}));
              }}
            >
              <option disabled selected>Package</option>
              {this.renderPacks()}
            </select>
            <select className='form-control'
              value={this.state.data.teacher}
              onChange={e => {
                this.updateSchedule('teacher', e.target.value);
                this.setState(update(this.state, {selectedTeacherIndex: {$set: parseInt(e.target.selectedIndex)-1}}));
              }}
            >
              <option disabled selected>Teacher</option>
              {this.renderTeachers()}
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
            Create New Student Schedule
            </button>
          </div>
          <Calendar events={this.getCalendarEvents()}
            eventPropGetter={(event,start,end,isSelected) => {
              if (event.student) { return {style: {backgroundColor:'red'}}; }
              else { return {style: {backgroundColor:'green'}}; }
            }}
            onSelectEvent={event => {
              if (event.student)
                this.setState(update(this.state,{selectedEvent:{$set: event}}));
              else
                this.setState(update(this.state,{selectedEvent:{$set: null}}));
            }}
          />
        </div>
      </div>
    );
  }
}

export default ScheduleForm;
