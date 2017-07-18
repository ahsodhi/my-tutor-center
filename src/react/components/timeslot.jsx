import React, { Component } from 'react';
import TimePicker from 'rc-time-picker';
import update from 'immutability-helper';

class TimeSlot extends Component {
  constructor(props) {
    super(props);
  }
  renderTimeSlot(onTimeChanged, defaultTime) {
    return (
      <TimePicker
        style={{ width: 100 }}
        defaultValue={defaultTime}
        showSecond={false}
        use12Hours
        onChange={onTimeChanged}
      />
    );
  }
  render() {
    return (
      <div>
        <div className='inline-form'>
          <span className='lbl'>From:</span>{this.renderTimeSlot(v => {
            let date = v._d;
            while (date.getDay() != this.props.day) {
              date.setDate(date.getDate() + 1);
            }
            this.props.onChange(this.props.day, date, 'start');
          }, this.props.defaultStart)}
        </div>
        <div className='inline-form'>
          <span className='lbl'>To:</span>{this.renderTimeSlot(v => {
            let date = v._d;
            while (date.getDay() != this.props.day) {
              date.setDate(date.getDate() + 1);
            }
            this.props.onChange(this.props.day, date, 'end');
          }, this.props.defaultEnd)}
        </div>
      </div>

    );
  }
}

export default TimeSlot;
