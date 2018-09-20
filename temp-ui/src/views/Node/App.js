import React, { Component } from 'react';
import Goes from './Goes/Goes';
import LLDP from './lldp/lldp';
import EthTool from './EthTool/EthTool';

class App extends Component {
    
  render() {
    return (
        <div>
            <Goes />
            <LLDP />
            <EthTool />
        </div>
    );
  }
}

export default App;
