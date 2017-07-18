import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'
import update from 'immutability-helper';

import Heading from '../heading.jsx';
import GetRequest from '../../utils/get_request';
import FormRequest from '../../utils/form_request';
import {InvoiceModal} from '../modals';

class Lessons extends Component {
  constructor(props) {
    super(props);
    this.state = {schedules:[],teachers:[],students:[],packs:[]};
  }
  componentDidMount() {
    GetRequest('/api/schedules', (resSchedule) => {
      if (resSchedule.success) {
        resSchedule.data.forEach(schedule => {
          GetRequest(`/api/teachers/${schedule.teacher}`, resTeacher => {
            this.setState(update(this.state, {teachers: {$push: [resTeacher.data] }}));
          });
          GetRequest(`/api/packages/${schedule.pack}`, resPack => {
            this.setState(update(this.state, {packs: {$push: [resPack.data] }}));
          });
        });
        GetRequest('/api/clients', (resClients) => {
          resClients.data.forEach(client => {
            client.students.forEach(student => {
              resSchedule.data.forEach(schedule => {
                if (schedule.student == student._id) {
                  this.setState(update(this.state, {students: {$push: [student] }}));
                }
              });
            });
          });
        });
        this.setState(update(this.state, {schedules: {$set: resSchedule.data }}));
      }
    });
  }
  removeScheduleRequest(scheduleId) {
    FormRequest('DELETE', {}, '/api/schedules/' + scheduleId, (response) => {
      var newSchedules = this.state.schedules.filter((elem) => elem._id != response.data._id)
      if (response.success) {
        this.setState(
          update(this.state, {schedules: {$set: newSchedules}})
        );
      }
    });
  }
  renderSchedules() {
    const html = this.state.schedules.map((schedule, index) => {
      const {students, packs, teachers} = this.state;
      return (
        <tr key={schedule._id}>
          <td>{teachers[index] ? teachers[index].firstName + ' ' + teachers[index].lastName : ''}</td>
          <td>{students[index] ? students[index].firstName + ' ' + students[index].lastName : ''}</td>
          <td>{packs[index] ? packs[index].name : ''}</td>
          <td>
            <Link to={`/edit_schedule/${schedule._id}`} className='btn btn-warning edit-button'>Edit</Link>&nbsp;
            <button onClick={this.removeScheduleRequest.bind(this, schedule._id)} className='btn btn-danger'>Remove</button>&nbsp;
            <button className='btn btn-info'
              onClick={() => {this.setState(update(this.state,{selectedIndex:{$set: index}}), () => {
                this.refs.invoiceModal.toggle()
              });}}
            >Generate Invoice</button>
          </td>
        </tr>
      );
    });
    return html;
  }
  render() {
    const {selectedIndex,packs,students,schedules} = this.state;
    return (
      <div>
        <InvoiceModal ref='invoiceModal'
          pack={packs[selectedIndex]}
          student={students[selectedIndex]}
          schedule={schedules[selectedIndex]}
        />
        <Heading text='Schedules'/>
        <Link to='/add_schedule'><button className='btn btn-default'>Add Schedule</button></Link>
        {
          this.state.schedules.length == 0 ?
          <h4><i>No schedules added</i></h4> :
          <table className='table-hover page-content'>
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Student</th>
                <th>Package</th>
              </tr>
            </thead>
            <tbody>
              {this.renderSchedules()}
            </tbody>
          </table>
        }
      </div>
    );
  }
}

export default Lessons;
