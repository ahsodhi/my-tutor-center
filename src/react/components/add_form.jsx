import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Heading from './heading.jsx';
import FormRequest from '../utils/form_request';

class AddForm extends Component {
  constructor(props) {
    super(props);
  }
  addRequest() {
    var data = this.refs.form.getFormData();
    FormRequest('POST', data, `${this.props.apiPath}/add`, (response) => {
      if (response.success) {
        this.props.history.push(this.props.routePath);
      }
    });
  }
  render() {
    return (
      <div>
        <Heading text={this.props.headingText}/>
        {
          React.cloneElement(this.props.formComponent, { ref: 'form' })
        }
        <input type='submit' className='btn btn-primary' value={this.props.addBtnText} onClick={this.addRequest.bind(this)}/>&nbsp;
        <Link to={this.props.routePath} className='btn btn-success'>Cancel</Link>
      </div>
    );
  }
}

export default AddForm;
