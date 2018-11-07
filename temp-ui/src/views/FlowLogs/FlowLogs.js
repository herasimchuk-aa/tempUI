import React, { Component } from 'react';
import '../../views/views.css'

class FlowLogs extends Component {
  render() {
    return (
      <iframe
        src='http://localhost:8080/flow-logs'
        style={{ height: '100%', width: '100%'}}
        frameBorder="0"
      />
    )
  }
}

export default FlowLogs;
