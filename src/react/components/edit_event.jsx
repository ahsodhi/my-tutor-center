import React, { Component } from 'react';
import moment from 'moment';
import update from 'immutability-helper';

import TimeSlot from './timeslot.jsx';

class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {data:this.props.event}
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.event) {
      this.setState(update(this.state,{data:{$set: nextProps.event}}));
    }
  }
  updateDate(oldDate, newDate) {
    let date = new Date(newDate);
    date.setDate(date.getDate()+1);
    date.setHours(oldDate.getHours());
    date.setMinutes(oldDate.getMinutes());
    return date;
  }
  render() {
    const dateString = this.state.data.start.toISOString();
    return (
      <div>
        <h3>Edit Event</h3>
        <input type='date' value={dateString.substr(0,10)}
          onChange={e => {
            const newDateStart = this.updateDate(this.state.data.start, new Date(Date.parse(e.target.value)));
            const newDateEnd = this.updateDate(this.state.data.end, new Date(Date.parse(e.target.value)));
            let newState = update(this.state,{data:{start:{$set: newDateStart}}});
            newState = update(newState, {data:{end:{$set: newDateEnd}}});
            this.setState(newState);
          }}
        />
        <TimeSlot day={this.state.data.start.getDay()}
          defaultStart={moment(this.state.data.start)} defaultEnd={moment(this.state.data.end)}
          onChange={(_,date,key) => {
            var newState = this.state;
            newState.data[key] = date;
            this.setState(newState);
          }}
        />
        <button className='btn btn-info'
          onClick={() => {this.props.onSave(this.state.data);}}
        >Save Event</button>
      </div>
    );
  }
}

export default EditEvent;
