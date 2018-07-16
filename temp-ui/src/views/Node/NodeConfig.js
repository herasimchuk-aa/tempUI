import React, { Component } from 'react';
import { Row, Col, Button, Label, Media } from 'reactstrap';
import { ServerAPI } from '../../ServerAPI';
import SummaryDataTable from './NodeSummary/SummaryDataTable';
import {customHistory} from '../../index';
import '../views.css';
import DropDown from '../../components/dropdown/DropDown';

class NodeConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleData: [],
      isoData: [],
      kernelData: [],
      typedata: [],
      nodes: props.location.state
    }
  }

  componentDidMount() {
    ServerAPI.DefaultServer().fetchAllRoles(this.retrieveRoleData, this);
    ServerAPI.DefaultServer().fetchAllIso(this.retrieveIsoData, this);
    ServerAPI.DefaultServer().fetchAllKernels(this.retrieveKernelsData, this);
    ServerAPI.DefaultServer().fetchAllSystemTypes(this.retrieveTypesData, this);
  }

  retrieveRoleData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ roleData: data });
      }
    }
  }

  retrieveIsoData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ isoData: data });
      }
    }
  }

  retrieveKernelsData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ kernelData: data });
      }
    }
  }

  retrieveTypesData(instance, data) {
    if (!data) {
      alert("No data received");
    }
    else {
      if (Object.keys(data).length) {
        instance.setState({ typedata: data });
      }
    }
  }
  getRoles() {
    let rolesHtml = [];
    this.state.roleData.map((item) => (rolesHtml.push(<option>{item.label}</option>)));
    return rolesHtml;
  }

  interfaceTableHeader() {
    return (
      <div className="padTop30">
        <h3>Interfaces</h3>
        <Row className="headerRow" style={{marginLeft : '0px'}}>
          <Col sm="3" className="head-name">Interface Name</Col>
          <Col sm="2" className="head-name">Admin state</Col>
          <Col sm="3" className="head-name">IP Address</Col>
          <Col sm="2" className="head-name">Remote Node Name</Col>
          <Col sm="2" className="head-name">Remote Interface</Col>
        </Row>
      </div>
    )
  }

  interfaceTableContent() {
    let rows = []
    if (this.state.nodes && this.state.nodes.length) {
      this.state.nodes.map((node) => {
        let interfaces = node.allInterfaces
        if (!interfaces || !interfaces.length) {
          let row = (<Row className='headerRow1'>
            <Col sm="12" className="pad"><h5 className="text-center">Interface data not available</h5></Col>
           
          </Row>)
          rows.push(row)
        }
        interfaces.map((item, i) => {
          let row1 = 'headerRow1'

          if (i % 2 === 0) {
            row1 = 'headerRow2'
          }
          if (i == interfaces.length - 1) {
            row1 =  row1 +' headerRow3 '
          }
          let row = (<Row className={row1} style={{marginLeft : '0px'}}>
            <Col sm="3" className="pad">{item.port ? item.port : '-' }</Col>
            <Col sm="2" className="pad">-</Col>
            <Col sm="3" className="pad">{item.IPAddress ? item.IPAddress : '-'}</Col>
            <Col sm="2" className="pad">-</Col>
            <Col sm="2" className="pad">-</Col>
          </Row>)
          rows.push(row)
        })

      })
    }
    return rows
  }

  checkBoxClick = (e) => {
    console.log('have fun',e)
  }

  editName(){
    document.getElementById('edit').style.display = 'none';
    document.getElementById('show').style.display = 'block';
  }

  showName(){
    document.getElementById('edit').style.display = 'block';
    document.getElementById('show').style.display = 'none';
  }

  render() {
    let {nodes} = this.state
    if(!nodes || !nodes.length){
      return <div></div>
    }
    let showN = 'showNode'
    let isSingleNode = this.state.nodes.length === 1 ? true : false
    let nodeNameDiv = null
    let interfaceTableHeader = null
    let interfaceTableContent = null
    let summaryDataTable =  null
    let serialNumber = null
    let defaultTypevalue = null
    let defaultKernelvalue = null
    let defaultIsovalue = null  
    if (isSingleNode) {
      nodeNameDiv = 
          <div>
              <Media className="edit" id="edit">
                <Media left>
                  {this.state.nodes.map((nodeItem) => nodeItem.name)} 
                  </Media>   
                  <Media right onClick={this.editName} className="marLeft10">
                  <i className="fa fa-pencil" aria-hidden="true" ></i>
                  </Media> 
              </Media>
              <Media className="show" id="show">
                <Row>    
                  <Col onClick={this.showName} className="sm-1">
                    <i className="fa fa-arrow-left" aria-hidden="true" ></i>
                  </Col> 
                  <Col className="sm-11">
                    <input type="text" className="form-control wid" name="name" value={this.state.nodes.map((nodeItem) => nodeItem.name)} />
                  </Col> 
                </Row>  
              </Media>
               <h6 className="srNo"><small>Sr. No.  </small> {this.state.nodes.map((nodeItem) => nodeItem.serialNumber)}</h6>
          </div>
      interfaceTableHeader = this.interfaceTableHeader()
      interfaceTableContent = this.interfaceTableContent()
   
      
      defaultIsovalue = nodes[0].linuxISO ? nodes[0].linuxISO : ' -- select an option --'
      defaultKernelvalue = nodes[0].kernel ? nodes[0].kernel : ' -- select an option --'
      defaultTypevalue = nodes[0].nodeType ? nodes[0].nodeType : ' -- select an option --'
    }else{
      let selectedRowIndexes = []
      this.state.nodes.map(function(node,i){
        selectedRowIndexes.push(i)
      })
      summaryDataTable = <SummaryDataTable nodes={this.state.nodes} selectedRowIndexes={selectedRowIndexes} checkBoxClick={this.checkBoxClick} />
    }
    return (
      <div className="animated fadeIn">
      <Media>
        <Media left >
        {nodeNameDiv}
        </Media>
        <Media body></Media>
        <Media right>
        <Button className="custBtn" outline color="secondary" onClick={()=>{customHistory.goBack()}}> Cancel </Button>
        <Button className="custBtn" outline color="secondary" > Provision </Button>
        <Button className="custBtn" outline color="secondary" > Save </Button>
        </Media>
      </Media>
      <div className="boxBorder">
        <Row className="pad">
         
          <Col xs='2' ><Label>Roles</Label><br />
            <select multiple className="form-control">{this.getRoles()}</select>
          </Col>
          <Col xs='2' ><Label>Type</Label><br />
            <DropDown options={this.state.typedata} />
          </Col>
          <Col xs='2' ><Label>Linux</Label><br />
            <DropDown options={this.state.kernelData} />
          </Col>
          <Col xs='2' ><Label>Base Linux ISO</Label><br />
            <DropDown options={this.state.isoData} />
          </Col>
        </Row>
        <Row className="pad">
         
          <Col xs='2' ><Label>/etc/frr/*.conf</Label><br />
              <select className="form-control">
                <option value="frr">/etc/frr/*.conf</option>
                <option value="etc">/etc/frr/*.conf</option>
                <option selected value="conf">/etc/frr/*.conf</option>
                <option value="fre">/etc/frr/*.conf</option>
              </select>
          </Col>
          <Col xs='2' ><Label>/etc/network/interface.d/*.conf</Label><br />
              <select className="form-control">
                <option value="frr">/etc/frr/*.conf</option>
                <option value="etc">/etc/frr/*.conf</option>
                <option selected value="conf">/etc/frr/*.conf</option>
                <option value="fre">/etc/frr/*.conf</option>
              </select>
          </Col>
          <Col xs='2' ><Label>/etc/goes/*.conf</Label><br />
              <select className="form-control">
                <option value="frr">/etc/frr/*.conf</option>
                <option value="etc">/etc/frr/*.conf</option>
                <option selected value="conf">/etc/frr/*.conf</option>
                <option value="fre">/etc/frr/*.conf</option>
              </select>
          </Col>
          <Col xs='2' ><Label>/etc/modprobe.d/*.conf</Label><br />
              <select className="form-control">
                <option value="frr">/etc/frr/*.conf</option>
                <option value="etc">/etc/frr/*.conf</option>
                <option selected value="conf">/etc/frr/*.conf</option>
                <option value="fre">/etc/frr/*.conf</option>
              </select>
          </Col>
          <Col xs='2' ><Label>/etc/ntp.conf</Label><br />
          <select className="form-control">
                <option value="frr">/etc/frr/*.conf</option>
                <option value="etc">/etc/frr/*.conf</option>
                <option selected value="conf">/etc/frr/*.conf</option>
                <option value="fre">/etc/frr/*.conf</option>
              </select>
          </Col>
        </Row>
        </div>
          {interfaceTableHeader}
          {interfaceTableContent}
          <div className="padTop20">
          {summaryDataTable}
          </div>

      </div>

    )
  }
}

export default NodeConfig;
