import React, { Component } from 'react';
import Goes from './Goes/Goes';
import LLDP from './lldp/lldp';
import EthTool from './EthTool/EthTool';
import Frr from './Frr/Frr';
import IpRoute from './IpRoute/IpRoute';
import ModProbe from './ModProbe/ModProbe';
import ModulesLoad from './ModulesLoad/ModulesLoad';

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
        <br />
        <ModProbe />
        <br />
        <ModulesLoad />
      </div>
    );
  }
}

export default App;
