import React, { Component } from 'react';

class Heading extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>{this.props.text}</h1>
        <hr/>
      </div>
    );
  }
}

export default Heading;
