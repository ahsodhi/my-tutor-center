import React, { Component, PropTypes } from 'react';
import ClientForm from './client_form.jsx';
import AddForm from '../add_form.jsx';

const AddClient = props =>
  <AddForm
    formComponent={<ClientForm/>}
    headingText='Add Client'
    routePath='/clients'
    apiPath='/api/clients'
    addBtnText='Add Client'
    history={props.history}
  />

export default AddClient;
