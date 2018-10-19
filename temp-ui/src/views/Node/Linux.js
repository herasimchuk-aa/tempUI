import React, { Component } from 'react';
import LinuxKernel from './LinuxKernel/LinuxKernel'
import BaseLinuxIso from './BaseLinuxIso/BaseLinuxIso'
import '../views.css';

class Linux extends Component {

  render() {
    return (
      <div>
        <LinuxKernel />
        <br />
        <BaseLinuxIso />
      </div>
    );
  }
}

export default Linux;
