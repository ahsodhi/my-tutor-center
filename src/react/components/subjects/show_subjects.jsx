import React, { Component } from 'react';
import Heading from '../heading.jsx';
import GetRequest from '../../utils/get_request';
import FormRequest from '../../utils/form_request';

class Subjects extends Component {
  constructor(props) {
    super(props);
    this.state = { subjects: [], editing: [] };
  }
  componentDidMount() {
    GetRequest('/api/subjects', (response) => {
      if (response.success) {
        var newState = this.state;
        response.data.forEach(_ => {newState.editing.push(0);})
        newState.subjects = response.data;
        this.setState(newState);
      }
    });
  }
  removeSubject(index) {
    var newState = this.state;
    newState.subjects = newState.subjects.filter((_, i) => i != index);
    newState.editing = newState.editing.filter((_, i) => i != index);
    this.setState(newState);
  }
  removeSubjectRequest(subjectId, index) {
    if (subjectId) {
      FormRequest('DELETE', {}, '/api/subjects/' + subjectId, (response) => {
        if (response.success) {
          this.removeSubject(index);
        }
      });
    }
    else {
      this.removeSubject(index);
    }
  }
  updateSubjectRequest(subjectId, index) {
    var data = this.state.subjects[index];
    if (subjectId) {
      FormRequest('PUT', data, `/api/subjects/${subjectId}`, (response) => {
        if (response.success) {
          var newState = this.state;
          newState.subjects[index] = data;
          newState.editing[index] = 0;
          this.setState(newState);
        }
      });
    }
    else {
      FormRequest('POST', data, '/api/subjects/add', (response) => {
        if (response.success) {
          var newState = this.state;
          newState.editing = newState.editing.filter((_,i) => i != index);
          newState.subjects = newState.subjects.filter((_,i) => i != index);
          newState.subjects.push(response.data);
          newState.editing.push(0);
          this.setState(newState);
        }
      })
    }
  }
  updateSubject(index, value) {
    var newState = this.state;
    newState.subjects[index].name = value;
    this.setState(newState);
  }
  renderSubjects() {
    const html = this.state.subjects.map((subject, index) => {
      return (
        <li key={index} className='subject-list-item'>
          <input type='text' className='form-control' value={subject.name}
            onChange={e => {this.updateSubject.call(this, index, e.target.value);}}
            disabled={this.state.editing[index] ? false : true} />&nbsp;
          {
            this.state.editing[index] ?
            <button className='btn btn-info'
              onClick={this.updateSubjectRequest.bind(this, subject._id, index)}
            >Save</button> :
            <button className='btn btn-warning'
              onClick={() => {
                var newState = this.state;
                newState.editing[index] = 1;
                this.setState(newState);
              }}
            >Edit</button>
          }&nbsp;
          <button className='btn btn-danger'
            onClick={this.removeSubjectRequest.bind(this, subject._id, index)}>Remove</button>
        </li>
      );
    });
    return html;
  }
  render() {
    return (
      <div>
        <Heading text='Subjects'/>
        <button className='btn btn-default'
          onClick={() => {
            var newState = this.state;
            newState.subjects.push({name:''});
            newState.editing.push(1);
            this.setState(newState);
          }}
        >Add New Subject</button>
        {
          this.state.subjects.length == 0 ?
          <h4><i>No subjects in database</i></h4> :
          <ul className='subject-list'>
            {this.renderSubjects()}
          </ul>
        }
      </div>
    );
  }
}

export default Subjects;
