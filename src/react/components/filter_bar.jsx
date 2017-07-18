import React, { Component } from 'react';

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }
  filterData(...arrays) {
    var toBeIncluded = []
    for (var index in arrays) {
      arrays[index].forEach(obj => {
        for (var key in obj) {
          var val = obj[key];
          if (!isNaN(val)) { val = val.toString(); }
          if (this.state.query.includes(val)) {
            toBeIncluded.push(index);
          }
        }
      })
    }
    return Object.keys(arrays).filter(index => toBeIncluded.indexOf(index) != -1)
      .reduce((obj, index) => { obj[index] = arrays[index]; return obj });
  }
  render() {
    return (
      <div className={this.props.classProp}>
        <div className='input-group'>
          <span className='input-group-addon'><i className="fa fa-search" aria-hidden="true"></i></span>
          <input type='text' className='form-control' placeholder='Filter Resutls...'
            value={this.state.query}
            onChange={e => { this.setState({ query: e.target.value })}}
          />
        </div>
      </div>
    )
  }
}

export default FilterBar;
