import React, { Component } from 'react';
import Modal from 'react-modal';
import update from 'immutability-helper';
import jsPDF from 'jspdf';

import {LOGO} from '../../utils/b64_logo';
import GetRequest from '../../utils/get_request';
import { findMinDate, findMaxDate } from '../../utils/date_utils.js';

import ModalStyles from './modal_styles';

class InvoiceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {modal:false,data:{}}
  }
  componentDidMount() {
    GetRequest('/api/clients', (resClients) => {
      this.setState(update(this.state,{data:{clients:{$set: resClients.data}}}));
    });
    GetRequest('/api/payments', (resPayments) => {
      this.setState(update(this.state,{data:{payments:{$set: resPayments.data}}}));
    });
  }
  toggle() {
    this.setState(update(this.state,{modal:{$set: true}}));
  }
  getClientInfo() {
    let parents = [];
    this.state.data.clients.forEach(client => {
      client.students.forEach(student => {
        if (student._id == this.props.student._id) {
          parents = client.parents;
        }
      });
    });
    const parentName = parents[0].firstName + ' ' + parents[0].lastName;
    const studentName = this.props.student.firstName + ' ' + this.props.student.lastName;
    const address = parents[0].address;
    return (
      [parentName,studentName,address]
    );
  }
  getPackInfo() {
    const {pack} = this.props
    return (
      [pack.name,pack.description,pack.price,pack.period]
    );
  }
  getScheduleInfo() {
    const endDate = findMaxDate(this.props.schedule.events);
    const startDate = findMinDate(this.props.schedule.events);
    const startDateString = startDate.toUTCString().substr(5,11);
    const endDateString = endDate.toUTCString().substr(5,11);
    return {startDate,endDate,startDateString,endDateString};
  }
  getPrice(startDate,endDate,packPrice,packPeriod) {
    packPeriod = parseInt(packPeriod);
    if (packPeriod == 0) {
      const msPerWeek = 24 * 7 * 60 * 60 * 1000;
      const numWeeks = Math.ceil((endDate-startDate)/msPerWeek);
      return packPrice * numWeeks;
    }
    else if (packPeriod == 1) {
      const msPerMonth = 24 * 30 * 60 * 60 * 1000;
      const numMonths = Math.ceil((endDate-startDate)/msPerMonth);
      return packPrice * numMonths;
    }
    else { return 0; }
  }
  getHours() {
    let totalHoursMs = 0;
    const msPerHour = 60 * 60 * 1000;
    this.props.schedule.events.forEach(event => {
      const start = new Date(Date.parse(event.start));
      const end = new Date(Date.parse(event.end));
      totalHoursMs += (end-start);
    });
    return Math.ceil(totalHoursMs / msPerHour);
  }
  getPaymentsInfo() {
    const {payments} = this.state.data;
    const index = payments.findIndex(p => p.schedule == this.props.schedule._id);
    const payment = payments[index];
    const content = [];
    let totalPaid = 0;
    if (payment) {
      payment.payments.forEach(pay => {
        content.push({method:pay.method,amount:pay.amount,date:pay.date});
        totalPaid += pay.amount;
      });
    }
    return {paymentInfo:content,totalPaid};
  }
  render() {
    return (
      <Modal
        isOpen={this.state.modal}
        style={ModalStyles}
        contentLabel='Generate Invoice'
      >
        <div>
          <h3>Invoice Set Up</h3>
          <button className='btn btn-info' onClick={() => {
            if (this.state.data) {
              const doc = new jsPDF('portrait','mm','letter');
              const image = LOGO;
              doc.addImage(image, 'JPEG', 150, 5, 50, 50);
              const date = new Date(Date.now()).toUTCString();              
              doc.setFontSize(24);
              doc.text('MyTutor Center', 15, 15);
              doc.setFontSize(18);
              doc.text(['220 Baker Street.',
                        'Guelph ON, N1L 2M4',
                        'Ph.: 647-888-9978','\n',
                        date.substr(0,16)],15,25);
              doc.setFontStyle('bold');
              const clientInfo = this.getClientInfo();
              const packInfo = this.getPackInfo();
              const {startDate,endDate,startDateString,endDateString} = this.getScheduleInfo();
              const price = this.getPrice(startDate,endDate,packInfo[2],packInfo[3]);
              const priceString = price.toLocaleString(undefined, {currency:'USD',style:'currency'})
              const packPrice = packInfo[2].toLocaleString(undefined, {currency:'USD',style:'currency'})
              const hours = this.getHours();
              const period = ['Per Week','Per Month'];
              const payMethods = ['Credit Card','Debit Card','Cash'];
              const {paymentInfo,totalPaid} = this.getPaymentsInfo();
              const balanceDue = (price-totalPaid).toLocaleString(undefined, {currency:'USD',style:'currency'});
              console.log(clientInfo);
              doc.text(clientInfo,15,70);
              doc.setFontStyle('normal');
              console.log('pack info');
              doc.text([packInfo[0],packInfo[1],`${packPrice} ${period[packInfo[3]]}`],15,100);
              doc.text(`From ${startDateString} to ${endDateString}`,15,130);
              doc.text(`${hours} Hours`,15,140);
              doc.text(`Cost: ${priceString}`,15,150);
              let offset = 0;
              console.log(paymentInfo);
              paymentInfo.forEach((payment,i) => {
                const payDate = new Date(Date.parse(payment.date)).toUTCString().substr(5,11);
                const payAmount = payment.amount.toLocaleString(undefined, {currency:'USD',style:'currency'});
                doc.text(`Payment by ${payMethods[payment.method-1]} on ${payDate}`,15,170+(10*i));
                doc.text(`${payAmount}`,160,170+(10*i));
                offset = 170 + 10 * (i+2);
              });
              doc.text(`Balance Due:`,15,offset);
              doc.text(`${balanceDue}`,160,offset);
              const filename = `${clientInfo[0]}_${clientInfo[1]}_${packInfo[0]}.pdf`.replace(/ /g, '_');
              doc.save(filename);
            }
          }}>Save</button>&nbsp;
          <button className='btn btn-danger' onClick={() => {
            this.setState(update(this.state, {modal: {$set: false}}));
          }}>Close</button>
        </div>
      </Modal>
    );
  }
}

export default InvoiceModal;
