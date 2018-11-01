import React, { Component } from 'react';
import LinuxKernel from './LinuxKernel/LinuxKernel'
import BaseLinuxIso from './BaseLinuxIso/BaseLinuxIso'
import '../views.css';
import PreScript from './PreScript/PreScript';
import PostScript from './PostScript/PostScript';

class Linux extends Component {

  render() {
    return (
      <div>
        <LinuxKernel />
        <br />
        <BaseLinuxIso />
        <br />
        <PreScript />
        <br />
        <PostScript />
      </div>
    );
  }
}

export default Linux;
