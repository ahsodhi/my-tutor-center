import React, { Component, PropTypes } from 'react';
import PackageForm from './package_form.jsx';
import EditForm from '../edit_form.jsx';

const EditPackage = props =>
  <EditForm
    formComponent={<PackageForm/>}
    headingText='Edit Package'
    routePath='/packages'
    apiPath='/api/packages'
    updateBtnText='Update Package'
    history={props.history}
    id={props.match.params.id}
  />

export default EditPackage;
