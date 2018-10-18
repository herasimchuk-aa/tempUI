import React, { Component } from 'react';
import {
  NavbarToggler,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem


} from 'reactstrap';
import '../../views/views.css';
import { Redirect } from 'react-router-dom';

class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      logout: false
    }
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  logOut = () => {
    this.setState({ logout: true })
  }

  render() {
    if (this.state.logout) {
      return <Redirect to={{ pathname: '/' }} />
    }
    return (
      <header className="app-header navbar">
        {/* <div className="HeaderNameClass" style={{ width: '9%', textAlign: 'center', lineHeight: '25px' }}> PLATINA <font style={{ fontSize: '14px' }}>COMMAND CENTER</font></div> */}
        <div className="HeaderNameClass"> PLATINA COMMAND CENTER</div>
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>

        <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarMinimize}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        {/* <Button className="custBtn" onClick={() => (this.logOut())}><span>Log Out</span></Button> */}
        <UncontrolledDropdown setActiveFromChild>
          <DropdownToggle tag="a" className="nav-link cursor-pointer " caret>
            Account
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem > Profile</DropdownItem>
            <DropdownItem onClick={() => (this.logOut())}> Log Out</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

        {/* <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler> */}
      </header>
    );
  }
}

export default Header;
//36: http://localhost:8082/#/dashboard