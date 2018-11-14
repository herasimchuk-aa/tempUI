import React, { Component } from 'react';
import '../../views/views.css'
import { GRAPH_FLOW } from "../../apis/RestConfig";


class FlowLogs extends Component {
  render() {
      let graphUrl = Window.graphGuiIP+GRAPH_FLOW
      return (
      <iframe
        src={graphUrl}
        style={{ height: '100%', width: '100%'}}
        frameBorder="0"
      />
    )
  }
}

export default FlowLogs;