import React, { Component, PropTypes } from 'react';
import TeacherForm from './teacher_form.jsx';
import EditForm from '../edit_form.jsx';

const EditTeacher = props =>
  <EditForm
    formComponent={<TeacherForm/>}
    headingText='Edit Teacher'
    routePath='/teachers'
    apiPath='/api/teachers'
    updateBtnText='Update Teacher'
    history={props.history}
    id={props.match.params.id}
  />

export default EditTeacher;
