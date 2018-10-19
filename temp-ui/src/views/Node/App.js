import React, { Component } from 'react';
import Goes from './Goes/Goes';
import LLDP from './lldp/lldp';
import EthTool from './EthTool/EthTool';
import Frr from './Frr/Frr';
import IpRoute from './IpRoute/IpRoute';

class App extends Component {

  render() {
    return (
      <div>
        <Goes />
        <br />
        <LLDP />
        <br />
        <EthTool />
        <br />
        <Frr />
        <br />
        <IpRoute />
      </div>
    );
  }
}

export default App;
