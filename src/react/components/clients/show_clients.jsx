import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';

import {PaymentModal} from '../modals';
import Heading from '../heading.jsx';
import GetRequest from '../../utils/get_request';
import FormRequest from '../../utils/form_request';
import FilterBar from '../filter_bar.jsx';

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = { clients: [], selectedClient:{students:[]} };
  }
  componentDidMount() {
    GetRequest('/api/clients', (response) => {
      this.setState(update(this.state,{clients:{$set: response.data}}));
    });
  }
  removeClientRequest(clientId) {
    FormRequest('DELETE', {}, '/api/clients/' + clientId, (response) => {
      if (response.success) {
        this.setState(update(this.state,
          {clients: {$set: this.state.clients.filter((elem) => elem._id != response.data._id)}}
        ));
      }
    });
  }
  renderClients() {
    const html = this.state.clients.map((client, index) => {
      const {parents,students} = client;
      const content = students.map((stud,i) =>
        <tr key={client._id+i}>
          <td>{stud.firstName + ' ' + stud.lastName}</td>
          <td>{client.parents ? client.parents[0].firstName + ' ' + client.parents[0].lastName : ''}</td>
          <td>{client.parents ? client.parents[0].homePhone : ''}</td>
          <td>{client.parents ? client.parents[0].email : ''}</td>
          <td>
            <Link to={`/edit_client/${client._id}`} className='btn btn-warning edit-button'>Edit</Link>&nbsp;
            <button onClick={this.removeClientRequest.bind(this, client._id)} className='btn btn-danger'>Remove</button>&nbsp;
            <button className='btn btn-info' onClick={() => {
              this.setState(update(this.state,{selectedClient:{$set: client}}), () => {
                this.refs.paymentModal.toggle();
              });
            }}>Receive Payment</button>
          </td>
        </tr>
      );
      return content;
    });
    return html;
  }
  render() {
    return (
      <div>
        <PaymentModal ref='paymentModal' client={this.state.selectedClient} />
        <Heading text='Clients'/>
        <div className='flex-header'>
          <Link to='/add_client'><button className='btn btn-default'>Add New Client</button></Link>
          <FilterBar ref='filterBar' classProp='filter-bar'/>
        </div>
        {
          this.state.clients.length == 0 ?
          <h4><i>No clients in database</i></h4> :
          <table className='table-hover page-content'>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Parent Name</th>
                <th>Parent Home Phone</th>
                <th>Parent Email</th>
              </tr>
            </thead>
            <tbody>
              {this.renderClients()}
            </tbody>
          </table>
        }
      </div>
    );
  }
}

export default Clients;
