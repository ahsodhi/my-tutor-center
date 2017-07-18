import React, { Component, PropTypes } from 'react';
import ScheduleForm from './schedule_form.jsx';
import EditForm from '../edit_form.jsx';

const EditSchedule = props =>
  <EditForm
    formComponent={<ScheduleForm/>}
    headingText='Edit Schedule'
    routePath='/schedules'
    apiPath='/api/schedules'
    updateBtnText='Update Schedule'
    history={props.history}
    id={props.match.params.id}
  />

export default EditSchedule;
