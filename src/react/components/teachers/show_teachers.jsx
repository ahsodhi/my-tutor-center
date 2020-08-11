import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Heading from '../heading.jsx';
import GetRequest from '../../utils/get_request';
import FormRequest from '../../utils/form_request';
import FilterBar from '../filter_bar.jsx';

class Teachers extends Component {
  constructor(props) {
    super(props);
    this.state = { teachers: [] };
  }
  componentDidMount() {
    GetRequest('/api/teachers', (response) => {
      this.setState({ teachers: response.data });
    });
  }
  removeTeacherRequest(teacherId) {
    FormRequest('DELETE', {}, '/api/teachers/' + teacherId, (response) => {
      if (response.success) {
        this.setState({
          teachers: this.state.teachers.filter((elem) => elem._id != response.data._id)
        });
      }
    });
  }
  renderTeachers() {
    const html = this.state.teachers.map((teacher, index) => {
      return (
        <tr key={teacher._id}>
          <td>{teacher.firstName + ' ' + teacher.lastName}</td>
          <td>{teacher.phone}</td>
          <td>{teacher.email}</td>
          <td>
            <Link to={`/edit_teacher/${teacher._id}`} className='btn btn-warning edit-button'>Edit</Link>&nbsp;
            <button onClick={this.removeTeacherRequest.bind(this, teacher._id)} className='btn btn-danger'>Remove</button>
          </td>
        </tr>
      );
    });
    return html;
  }
  render() {
    return (
      <div>
        <Heading text='Teachers'/>
        <div className="flex-header">
          <Link to='/add_teacher'><button className='btn btn-default'>Add New Teacher</button></Link>
          <FilterBar ref='filterBar' classProp='filter-bar'/>
        </div>
        {
          this.state.teachers.length == 0 ?
          <h4><i>No teachers added</i></h4> :
          <table className='table-hover page-content'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {this.renderTeachers()}
            </tbody>
          </table>
        }
      </div>
    );
  }
}

export default Teachers;
