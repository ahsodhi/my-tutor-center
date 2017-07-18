import React, { Component, PropTypes } from 'react';
import ScheduleForm from './schedule_form.jsx';
import AddForm from '../add_form.jsx';

const AddSchdule = props =>
  <AddForm
    formComponent={<ScheduleForm/>}
    headingText='Add Schedule'
    routePath='/schedules'
    apiPath='/api/schedules'
    addBtnText='Add Schedule'
    history={props.history}
  />

export default AddSchdule;
