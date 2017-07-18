import React, { Component, PropTypes } from 'react';
import ClientForm from './client_form.jsx';
import EditForm from '../edit_form.jsx';

const EditClient = props =>
  <EditForm
    formComponent={<ClientForm/>}
    headingText='Edit Client'
    routePath='/clients'
    apiPath='/api/clients'
    updateBtnText='Update Client'
    history={props.history}
    id={props.match.params.id}
  />

export default EditClient;
