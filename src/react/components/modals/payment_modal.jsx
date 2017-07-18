import React, { Component } from 'react';
import Modal from 'react-modal';
import update from 'immutability-helper';

import FormRequest from '../../utils/form_request';
import GetRequest from '../../utils/get_request';
import ModalStyles from './modal_styles';

class PaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {modal:false,packs:[],paymentMethod:0}
  }
  componentDidMount() {
    GetRequest('/api/packages', response => {
      this.setState(update(this.state,{packs:{$set: response.data}}));
    });
  }
  toggle() {
    this.setState(update(this.state,{modal:{$set: true}}));
  }
  renderStudentOptions() {
    const html = this.props.client.students.map((student, i) => {
      return (
        <option key={i} value={student._id}>{student.firstName + ' ' + student.lastName}</option>
      )
    });
    return html;
  }
  renderStudentPackOptions() {
    let html = null;
    const {packs} = this.state;
    if (this.state.selectedStudentIndex >= 0) {
      html = this.props.client.students[this.state.selectedStudentIndex].packs.map((pack, i) => {
        return (
          <option key={i} value={pack}>{packs[packs.findIndex(p => pack == p._id)].name}</option>
        )
      });
    }
    return html;
  }
  onSave() {
    const s = this.props.client.students[this.state.selectedStudentIndex];
    const p = s.packs[this.state.selectedPackIndex];
    console.log(s._id, p);
    FormRequest('POST', {student:s._id,pack:p}, '/api/find_student_schedule', response => {
      if (response.success) {
        const schedule = response.data;
        FormRequest('POST', {
          schedule: schedule._id, amount: this.state.amount,
          date: new Date(Date.now()), method: this.state.paymentMethod
        }, '/api/payments/update', response => {
          if (response.success) {
            this.setState(update(this.state,{modal:{$set: false}}));
          }
        });
      }
    });
  }
  render() {
    const {selectedStudentIndex,selectedPackIndex} = this.state;
    const {client} = this.props;
    return (
      <Modal
        isOpen={this.state.modal}
        style={ModalStyles}
        contentLabel='Generate Invoice'
      >
        <div>
          <h3>Receive Payment</h3>
          <div className='form-group'>
            <select value={selectedStudentIndex>=0 ? client.students[selectedStudentIndex]._id : false} className='form-control'
              onChange={e => {this.setState(update(this.state,{selectedStudentIndex:{$set: e.target.selectedIndex-1}}));}}
            >
              <option value='0'>Student</option>
              {this.renderStudentOptions()}
            </select>
            <select value={selectedStudentIndex>=0 ? client.students[selectedStudentIndex].packs[selectedPackIndex] : false}
              className='form-control'
              onChange={e => {this.setState(update(this.state,{selectedPackIndex:{$set: e.target.selectedIndex-1}}));}}
            >
              <option value='0'>Package</option>
              {this.renderStudentPackOptions()}
            </select>
            <div className='input-group' style={{maxWidth:'300px'}}>
              <span className='input-group-addon'>$</span>
              <input type='number' step='0.01' className='form-control' placeholder='Amount'
                value={this.state.amount}
                onChange={e => {this.setState(update(this.state,{amount:{$set: parseFloat(e.target.value)}}));}}
              />
            </div>
            <select value={this.state.paymentMethod.toString()}
              className='form-control'
              onChange={e => {this.setState(update(this.state,{paymentMethod:{$set: parseInt(e.target.value)}}));}}
            >
              <option value='0' disabled>Payment Method</option>
              <option value='1'>Credit Card</option>
              <option value='2'>Debit Card</option>
              <option value='3'>Cash</option>
            </select>
          </div>
          <div className='inline-form'>
            <button className='btn btn-info' onClick={this.onSave.bind(this)}>Save</button>&nbsp;
            <button className='btn btn-danger' onClick={() => {
              this.setState(update(this.state, {modal: {$set: false}}));
            }}>Close</button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default PaymentModal;
