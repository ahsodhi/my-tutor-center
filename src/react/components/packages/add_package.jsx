import React, { Component, PropTypes } from 'react';
import PackageForm from './package_form.jsx';
import AddForm from '../add_form.jsx';

const AddPackage = props =>
  <AddForm
    formComponent={<PackageForm/>}
    headingText='Add Package'
    routePath='/packages'
    apiPath='/api/packages'
    addBtnText='Add Package'
    history={props.history}
  />

export default AddPackage;
