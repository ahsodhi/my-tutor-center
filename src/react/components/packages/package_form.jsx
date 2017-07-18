import React, { Component } from 'react';
import update from 'immutability-helper';
import GetRequest from '../../utils/get_request';
import Heading from '../heading.jsx';

class ClientForm extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {
      name: '',
      period: '', // 0 = weekly, 1 = monthly
      price: 0,
      grades: [], // 0 = other
      description: '',
      subjects: []
    }, subjects:[] };
  }
  componentDidMount() {
    GetRequest('/api/subjects', (response) => {
      this.setState(update(this.state, {subjects: {$set: response.data}}));
    });
    if (this.props.id) {
      GetRequest('/api/packages/' + this.props.id, (response) => {
        if (response.success) {
          this.setState(update(this.state, {data: {$set: response.data}}));
        }
      });
    }
  }
  getFormData() {
    return this.state.data;
  }
  updatePack(field, value, flag=false) {
    var pack = this.state.data;
    if (flag) { value = parseFloat(value); }
    pack[field] = value;
    this.setState(update(this.state, {data: {$set: pack}}));
  }
  updatePackGrades(checked, value) {
    value = parseInt(value);
    const {grades}  = this.state.data;
    if (checked && grades.indexOf(value) == -1) {
      var newState = update(this.state, {data: {grades: {$push: [value]}}});
      this.setState(newState);
    }
    else if (!checked && grades.indexOf(value) != -1) {
      var newGrades = grades.filter(v => v != value);
      var newState = update(this.state, {data: {grades: {$set: newGrades}}});
      this.setState(newState);
    }
  }
  renderGradeOptions() {
    const html = Array(12).fill().map((_, i) => {
      return (
        <div key={i}>
          Grade {i+1} <input type='checkbox' value={i+1} checked={this.state.data.grades.indexOf(i+1) != -1}
            onChange={(e) => { this.updatePackGrades.call(this, e.target.checked, e.target.value); }}
          />
        </div>
      );
    });
    return html;
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
  updateSubjects(selected, value) {
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
  render() {
    const p = this.state.data;
    return (
      <div className='form-container'>
        <div className='form'>
          <div className='form-group'>
            <input type='text' className='form-control' placeholder='Package Name' value={p.name}
              onChange={(e) => { this.updatePack.call(this, 'name', e.target.value); }}
            />
            <textarea rows='3' className='form-control' placeholder='Package Description' value={p.description}
              onChange={(e) => { this.updatePack.call(this, 'description', e.target.value); }}
            >
            </textarea>
            <div className='input-group'>
              <span className='input-group-addon'><i className="fa fa-usd" aria-hidden="true"></i></span>
              <input type='number' step='0.01' className='form-control' placeholder='Price' value={p.price}
                onChange={(e) => { this.updatePack.call(this, 'price', e.target.value, true); }}
              />
            </div>
            <select className='form-control' value={p.period}
              onChange={(e) => { this.updatePack.call(this, 'period', e.target.value); }}
            >
              <option disabled selected>Period</option>
              <option value='0'>Weekly</option>
              <option value='1'>Monthly</option>
            </select>
            <div className='checkboxes'>
              {this.renderGradeOptions()}
              <div>
                Other <input type='checkbox' value='0' checked={this.state.data.grades.indexOf(0) != -1}
                  onChange={(e) => { this.updatePackGrades.call(this, e.target.checked, e.target.value); }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='form'>
          <select multiple className='form-control'
          style={{height:'200px'}}
          onChange={(e) => {
            const elems = e.target.children;
            for (var i = 0; i < elems.length; i++) {
              this.updateSubjects(elems[i].selected, elems[i].value);
            }
          }}>
            <option style={{'textAlign':'right'}} disabled>Subjects</option>
            {this.renderSubjects()}
          </select>
        </div>
      </div>
    );
  }
}

export default ClientForm;
