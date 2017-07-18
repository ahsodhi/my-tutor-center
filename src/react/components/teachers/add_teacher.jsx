import React, { Component, PropTypes } from 'react';
import TeacherForm from './teacher_form.jsx';
import AddForm from '../add_form.jsx';

const AddTeacher = props =>
  <AddForm
    formComponent={<TeacherForm/>}
    headingText='Add Teacher'
    routePath='/teachers'
    apiPath='/api/teachers'
    addBtnText='Add Teacher'
    history={props.history}
  />

export default AddTeacher;
