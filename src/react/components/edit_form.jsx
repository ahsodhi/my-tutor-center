import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Heading from './heading.jsx';
import FormRequest from '../utils/form_request';

class EditForm extends Component {
  constructor(props) {
    super(props);
  }
  updateRequest() {
    var data = this.refs.form.getFormData();
    FormRequest('PUT', data, `${this.props.apiPath}/${this.props.id}`, (response) => {
      if (response.success) {
        this.props.history.push(this.props.routePath);
      }
    });
  }
  render() {
    return (
      <div>
        <Heading text={this.props.headingText} />
        {
          React.cloneElement(this.props.formComponent, { ref: 'form', id: this.props.id })
        }
        <input type='submit' className='btn btn-primary' value={this.props.updateBtnText} onClick={this.updateRequest.bind(this)}/>&nbsp;
        <Link to={this.props.routePath} className='btn btn-success'>Cancel</Link>
      </div>
    );
  }
}

export default EditForm;
