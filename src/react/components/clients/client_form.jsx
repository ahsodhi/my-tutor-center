import React, { Component } from 'react';
import update from 'immutability-helper';
import GetRequest from '../../utils/get_request';
import Heading from '../heading.jsx';

class ClientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        students: [{
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          status: '', // 0 = inactive, 1 = active, 2 = prospect
          notes: '',
          school: '',
          grade: -1,
          packs: [],
          billing: '' // 0 = per session, 1 = tutoring package
        }],
        parents: [{
            firstName: '',
            lastName: '',
            homePhone: '',
            cellPhone: '',
            notes: '',
            email: '',
            address: ''
        }]
      },
      packs: []
    };
  }
  componentDidMount() {
    GetRequest('/api/packages', (response) => {
      this.setState(update(this.state, {packs: {$set: response.data}}));
    });
    if (this.props.id) {
      GetRequest('/api/clients/' + this.props.id, (response) => {
        if (response.success) {
          this.setState(update(this.state, {data: {$set: response.data}}));
        }
      });
    }
  }
  getFormData() {
    return this.state.data;
  }
  updateStudent(index, field, value) {
    var studs = this.state.data.students;
    studs[index][field] = value;
    var newState = update(this.state, {data: {students: {$set: studs}}});
    this.setState(newState);
  }
  updateParent(index, field, value) {
    var parents = this.state.data.parents;
    parents[index][field] = value;
    var newState = update(this.state, {data: {parents: {$set: parents}}});
    this.setState(newState);
  }
  addStudent() {
    var newState = update(this.state, {data: {students: {$push: [{}]}}});
    this.setState(newState);
  }
  removeStudent(index) {
    var studs = this.state.data.students;
    studs = studs.filter((_, i) => i != index);
    var newState = update(this.state, {data: {students: {$set: studs}}});
    this.setState(newState);
  }
  addParent() {
    var newState = update(this.state, {data: {parents: {$push: [{}]}}});
    this.setState(newState);
  }
  removeParent(index) {
    var parents = this.state.data.parents;
    parents = parents.filter((_, i) => i != index);
    var newState = update(this.state, {data: {parents: {$set: parents}}});
    this.setState(newState);
  }
  renderPacks(s) {
    const html = this.state.packs.map((pack, i) => {
      if (pack.grades.indexOf(s.grade) != -1) {
        return (
          <option key={i} selected={s.packs ? s.packs.indexOf(pack._id) != -1 : false} value={pack._id}>
            {pack.name}
          </option>
        );
      }
    });
    return html;
  }
  updateStudentPacks(index, selected, value) {
    const {packs}  = this.state.data.students[index];
    var newState = this.state;
    if (selected && packs.indexOf(value) == -1) {
      newState.data.students[index].packs.push(value);
      this.setState(newState);
    }
    else if (!selected && packs.indexOf(value) != -1) {
      var newPacks = packs.filter(v => v != value);
      newState.data.students[index].packs = newPacks;
      this.setState(newState);
    }
  }
  renderGradeOptions(index) {
    const html = Array(12).fill().map((_, i) => {
      return (
          <option key={i+1} value={i+1}>Grade {i+1}</option>
      );
    });
    return html;
  }
  renderStudentForms() {
    const html = this.state.data.students.map((s, index) => {
      return (
        <div key={index} className='form'>
          <div className='form-header'>
            <h3>Student</h3>
            {
              index == 0 ?
              <button className='btn btn-info' onClick={this.addStudent.bind(this)}>Add Student</button> :
              <button className='btn btn-danger' onClick={this.removeStudent.bind(this, index)}>Remove Student</button>
            }
          </div>
          <div className='form-group'>
            <input type='text' className='form-control' placeholder='First Name' value={s.firstName}
              onChange={(e) => { this.updateStudent.call(this, index, 'firstName', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='Last Name' value={s.lastName}
              onChange={(e) => { this.updateStudent.call(this, index, 'lastName', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='Email' value={s.email}
              onChange={(e) => { this.updateStudent.call(this, index, 'email', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='Phone' value={s.phone}
              onChange={(e) => { this.updateStudent.call(this, index, 'phone', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='School' value={s.school}
              onChange={(e) => { this.updateStudent.call(this, index, 'school', e.target.value); }}
            />
            <select className='form-control' value={s.grade ? s.grade.toString() : false}
              onChange={(e) => { this.updateStudent.call(this, index, 'grade', parseInt(e.target.value)); }}
            >
              <option disabled>Grade</option>
              {this.renderGradeOptions(index)}
              <option value='0'>Other</option>
            </select>
            <select className='form-control' value={s.status}
              onChange={(e) => { this.updateStudent.call(this, index, 'status', e.target.value); }}
            >
              <option value='' selected disabled>Status</option>
              <option value='0'>Inactive</option>
              <option value='1'>Active</option>
              <option value='2'>Prospect</option>
            </select>
            <select className='form-control' value={s.billing}
              onChange={(e) => { this.updateStudent.call(this, index, 'billing', e.target.value); }}
            >
              <option value='' selected disabled>Billing Type</option>
              <option value='0'>Per Session</option>
              <option value='1'>Tutoring Package</option>
            </select>
            <select className='form-control' multiple
              onChange={e => {
                const elems = e.target.children;
                for (var i = 0; i < elems.length; i++) {
                  this.updateStudentPacks(index, elems[i].selected, elems[i].value);
                }
              }}
            >
              <option style={{textAlign:'right'}} disabled>Packages</option>
              {this.renderPacks(s)}
            </select>
            <textarea className='form-control' rows='4' placeholder='Student Notes'
              value={s.notes}
              onChange={(e) => { this.updateStudent.call(this, index, 'notes', e.target.value); }}
            >
            </textarea>
          </div>
        </div>
      );
    });
    return html;
  }
  renderParentForms() {
    const html = this.state.data.parents.map((p, index) =>
      <div key={index} className='form'>
        <div className='form-header'>
          <h3>Parent</h3>
          {
            index == 0 ?
            <button className='btn btn-info' onClick={this.addParent.bind(this)}>Add Parent</button> :
            <button className='btn btn-danger' onClick={this.removeParent.bind(this, index)}>Remove Parent</button>
          }
        </div>
        <div className='form-group'>
            <input type='text' className='form-control' placeholder='First Name' value={p.firstName}
              onChange={(e) => { this.updateParent.call(this, index, 'firstName', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='Last Name' value={p.lastName}
              onChange={(e) => { this.updateParent.call(this, index, 'lastName', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='Home Phome' value={p.homePhone}
              onChange={(e) => { this.updateParent.call(this, index, 'homePhone', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='Cell Phone' value={p.cellPhone}
              onChange={(e) => { this.updateParent.call(this, index, 'cellPhone', e.target.value); }}
            />
            <input type='text' className='form-control' placeholder='Email' value={p.email}
              onChange={(e) => { this.updateParent.call(this, index, 'email', e.target.value); }}
            />
            <textarea className='form-control' rows='2' placeholder='Address' value={p.address}
              onChange={(e) => { this.updateParent.call(this, index, 'address', e.target.value); }}
            >
            </textarea>
            <textarea className='form-control' rows='4' placeholder='Parent Notes' value={p.notes}
              onChange={(e) => { this.updateParent.call(this, index, 'notes', e.target.value); }}
            >
            </textarea>
        </div>
      </div>
    );
    return html;
  }
  render() {
    const p = this.state.data.parent;
    return (
      <div className='form-container'>
        {this.renderStudentForms()}
        {this.renderParentForms()}
      </div>
    );
  }
}

export default ClientForm;
