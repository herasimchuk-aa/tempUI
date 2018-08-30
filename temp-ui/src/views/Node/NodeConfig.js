import React, { Component } from 'react';
import { Row, Col, Button, Label, Media, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, UncontrolledTooltip } from 'reactstrap';
import { ServerAPI } from '../../ServerAPI';
import SummaryDataTable from './NodeSummary/SummaryDataTable';
import { customHistory } from '../../index';
import { Redirect } from 'react-router-dom';
import '../views.css';
import { nodeHead } from '../../consts';
import DropDown from '../../components/dropdown/DropDown';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import MultiselectDropDown from '../../components/MultiselectDropdown/MultiselectDropDown';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import DiscoverModal from '../../components/DiscoverModal/DiscoverModal';
import { invaderServerAddress } from '../../config';
import { FETCH_ALL_SITES, FETCH_ALL_ROLES, FETCH_ALL_ISOS, FETCH_ALL_KERNELS, FETCH_ALL_SYSTEM_TYPES } from '../../apis/RestConfig';
import { getRequest } from '../../apis/RestApi';

class NodeConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleData: [],
      isoData: [],
      kernelData: [],
      typeData: [],
      siteData: [],
      nodeHead: nodeHead,
      displayModel: false,
      displayNewInterfaceModel: false,
      interfaceData: {},
      interfaceIndex: null,
      nodes: props.location.state,
      selectedRowIndexes: [],
      // selectedType: props.location.state.length == 1 ? props.location.state[0].type : '',
      // selectedLinux: props.location.state.length == 1 ? props.location.state[0].kernel : '',
      // selectedIso: props.location.state.length == 1 ? props.location.state[0].iso : '',
      selectedRoles: props.location.state.length == 1 ? props.location.state[0].roleDetails : '',
      // selectedSite: props.location.state.length == 1 ? props.location.state[0].site : '',
      selectedSerialNo: props.location.state.length == 1 ? props.location.state[0].SN : '',
      selectedTypeId: props.location.state.length == 1 ? props.location.state[0].Type_Id : '',
      selectedLinuxId: props.location.state.length == 1 ? props.location.state[0].Kernel_Id : '',
      selectedIsoId: props.location.state.length == 1 ? props.location.state[0].Iso_Id : '',
      // selectedRolesId: props.location.state.length == 1 ? props.location.state[0].roles : '',
      selectedSiteId: props.location.state.length == 1 ? props.location.state[0].Site_Id : '',
      hostname: props.location.state[0].Name,
      displayProvisionModel: false,
      actualNode: {},
      wipeBtn: true,
      rebootBtn: true,
      saveBtn: true,
      openDiscoverModal: false,
      cancelNodeConfig: false,
      interfaces: props.location.state[0].allInterfaces,
      isLoading: false
    }
    this.counter = 0
    console.log(props.location.state)
  }

  componentDidMount() {
    this.getAllData()
  }

  getAllData = () => {
    let typeData = []
    let self = this
    let typePromise = getRequest(FETCH_ALL_SYSTEM_TYPES).then(function (json) {
      typeData = json.Data
    })

    let roleData = []
    let rolePromise = getRequest(FETCH_ALL_ROLES).then(function (json) {
      roleData = json.Data
    })

    let kernelData = []
    let kernelPromise = getRequest(FETCH_ALL_KERNELS).then(function (json) {
      kernelData = json.Data
    })

    let isoData = []
    let isoPromise = getRequest(FETCH_ALL_ISOS).then(function (json) {
      isoData = json.Data
    })

    let siteData = []
    let sitePromise = getRequest(FETCH_ALL_SITES).then(function (json) {
      siteData = json.Data
    })

    Promise.all([typePromise, rolePromise, kernelPromise, isoPromise, sitePromise]).then(function () {

      node = self.convertData(self.state.nodes, typeData, kernelData, isoData, siteData, roleData)
      self.setState({ nodes: node, selectedRoles: node.roleDetails, constNodes: Object.assign([], nodes) })
    }).then(function () {
      self.setState({ typedata: typeData, roleData: roleData, kernelData: kernelData, isoData: isoData, siteData: siteData })
    })


  }

  convertData(node, types, kernels, isos, sites, roles) {

    types.map((item) => {
      if (item.Id == node.Type_Id) {
        node.type = item.Name
      }
    })
    kernels.map((item) => {
      if (item.Id == node.Kernel_Id) {
        node.kernel = item.Name
      }
    })
    isos.map((item) => {
      if (item.Id == node.Iso_Id) {
        node.iso = item.Name
      }
    })
    sites.map((item) => {
      if (item.Id == node.Site_Id) {
        node.site = item.Name
      }
    })
    let roleIds = node.roles
    let roleDetails = []

    for (let roleId of roleIds) {
      for (let role of roles) {
        if (role.Id == roleId) {
          roleDetails.push(role)
          break
        }
      }
    }
    node.roleDetails = roleDetails
    return node
  }



  interfaceTableHeader() {
    return (
      <div className="padTop30">
        <Media>
          <Media left>
            <h5>Interfaces</h5>
          </Media>
          <Media body>
          </Media>
          <Media right>
            <Button className="custBtn" outline color="secondary" onClick={() => (this.openInterfaceModal())}> New </Button>
            <Button className="custBtn" outline color="secondary" onClick={() => (this.deleteInterface())}> Delete </Button>
          </Media>
        </Media>
        <Row className="headerRow" style={{ marginLeft: '0px', marginRight: '0px' }}>
          <Col sm="1" className="head-name"></Col>
          <Col sm="2" className="head-name">Interface Name</Col>
          <Col sm="2" className="head-name">Admin state</Col>
          <Col sm="2" className="head-name">IP Address</Col>
          <Col sm="2" className="head-name">Remote Node Name</Col>
          <Col sm="2" className="head-name">Remote Interface</Col>
          <Col sm="1" className="head-name">Edit</Col>
        </Row>
      </div>
    )
  }

  openInterfaceModal() {
    this.setState({ displayNewInterfaceModel: !this.state.displayNewInterfaceModel })
  }

  deleteInterface = () => {
    let arr = []
    let interfaces = this.state.nodes[0].allInterfaces
    interfaces.map((interfaceItem, index) => {
      for (let i = 0; i < this.state.selectedRowIndexes.length; i++) {
        if (index == this.state.selectedRowIndexes[i]) {
          arr.push(interfaceItem.port)
        }
      }
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] == interfaceItem.port) {
          delete interfaces[index]
        }
      }

    })

    interfaces = interfaces.filter(function (n) { return n != undefined })
    this.state.nodes[0].allInterfaces = interfaces
    this.setState({ interfaces: interfaces })

    let roles = [];
    let { selectedRoles } = this.state
    if (selectedRoles && selectedRoles.length) {
      selectedRoles.map((data) => (roles.push(data.Id)))
    }
    this.state.nodes[0].roles = roles
    let a = {
      nodes: this.state.nodes,
    }
    ServerAPI.DefaultServer().updateNode(this.deleteInterfaceCallback, this, a);
  }

  deleteInterfaceCallback(instance, data) {
    let a = instance.state.data
    if (!a) {
      a = []
    }
    a.push(data)
    instance.setState({ data: a, selectedRowIndexes: [], saveBtn: false })

    NotificationManager.success('deleted Successfully', 'Interface');
  }

  interfaceTableContent() {
    let rows = []
    let self = this
    if (this.state.interfaces && this.state.interfaces.length) {
      // this.state.nodes.map((node) => {
      let interfaces = this.state.interfaces
      if (!interfaces || !interfaces.length) {
        let row = (<Row className='headerRow1' style={{ marginLeft: '0px', marginRight: '0px' }}>
          <Col sm="12" className="pad"><h5 className="text-center">Interface data not available</h5></Col>
        </Row>)
        rows.push(row)
        return rows
      }
      interfaces.map((item, rowIndex) => {
        let row1 = 'headerRow1'
        if (rowIndex % 2 === 0) {
          row1 = 'headerRow2'
        }
        if (rowIndex == interfaces.length - 1) {
          row1 = row1 + ' headerRow3 '
        }
        /* let ipData = []
        let remoteInvaderData = []
        let remoteInterfaceData = []
        let color = '' */


        /* if (item.IPAddress) {
          if (node.validationStatus && node.validationStatus.interfacesStatus && Object.keys(node.validationStatus.interfacesStatus).length) {
            let portName = item.port
            if (node.validationStatus.interfacesStatus[portName] && node.validationStatus.interfacesStatus[portName].isValidIP) {
              color = "black"
            }
            else {
              color = "red"
            }
          }
          ipData = (<font color={color}>{item.IPAddress}</font>)
        }
        else {
          ipData = "-"
        } */

        /* **************** */


        /* if (item.connectedTo.serverName) {
          let remoteInvaderKey = 'remoteInvader' + rowIndex
          if (node.validationStatus && node.validationStatus.interfacesStatus && Object.keys(node.validationStatus.interfacesStatus).length) {
            let portName = item.port
            if (node.validationStatus.interfacesStatus[portName] && node.validationStatus.interfacesStatus[portName].isRemoteInvaderMatched) {
              color = "black"
            }
            else {
              color = "red"
              if (node.validationStatus.interfacesStatus[portName] && node.validationStatus.interfacesStatus[portName].remoteInvader)
                remoteInterfaceData.push(<UncontrolledTooltip placement="top" target={remoteInvaderKey}>{node.validationStatus.interfacesStatus[portName].remoteInvader}</UncontrolledTooltip>)
            }
          }
          remoteInvaderData = (<font id={remoteInvaderKey} color={color}>{item.connectedTo.serverName}</font>)
        }
        else {
          remoteInvaderData = "-"
        } */

        /* **************** */


        /* if (item.connectedTo.serverPort) {
          let remoteInterfaceKey = 'remoteInterface' + rowIndex
          if (node.validationStatus && node.validationStatus.interfacesStatus && Object.keys(node.validationStatus.interfacesStatus).length) {
            let portName = item.port
            if (node.validationStatus.interfacesStatus[portName] && node.validationStatus.interfacesStatus[portName].isLLDPMatched) {
              color = "black"
            }
            else {
              color = "red"
              if (node.validationStatus.interfacesStatus[portName] && node.validationStatus.interfacesStatus[portName].remoteInterface)
                remoteInterfaceData.push(<UncontrolledTooltip placement="top" target={remoteInterfaceKey}>{node.validationStatus.interfacesStatus[portName].remoteInterface}</UncontrolledTooltip>)
            }
          }
          remoteInterfaceData.push(<font id={remoteInterfaceKey} color={color}>{item.connectedTo.serverPort}</font>)
        }
        else {
          remoteInterfaceData = "-"
        } */


        let row = (<Row className={row1} style={{ marginLeft: '0px', marginRight: '0px' }}>
          <Col sm="1" className="pad" ><Input key={self.counter++} style={{ cursor: 'pointer', marginLeft: '0px' }}
            type="checkbox" onChange={() => (self.checkBoxClickInterface(rowIndex))} defaultChecked={false} /></Col>
          <Col sm="2" className="pad">{item.port ? item.port : '-'}</Col>
          <Col sm="2" className="pad">{item.adminState ? item.adminState : '-'}</Col>
          <Col sm="2" className="pad">{item.IPAddress ? item.IPAddress : '-'}</Col>
          <Col sm="2" className="pad">{item.connectedTo.serverName ? item.connectedTo.serverName : '-'}</Col>
          <Col sm="2" className="pad">{item.connectedTo.serverPort ? item.connectedTo.serverPort : "-"}</Col>
          <Col sm="1" className="pad" style={{ cursor: 'pointer' }}><i className="fa fa-pencil" aria-hidden="true" onClick={() => (self.updatInterfaceModal(rowIndex))}></i></Col>

        </Row>)
        rows.push(row)
      })

      // })
    }
    return rows
  }

  checkBoxClickInterface = (rowIndex) => {
    let { selectedRowIndexes } = this.state
    let arrayIndex = selectedRowIndexes.indexOf(rowIndex)
    if (arrayIndex > -1) {
      selectedRowIndexes.splice(arrayIndex, 1)
    } else {
      selectedRowIndexes.push(rowIndex)
    }
    //this.setState({selectedRowIndexes:selectedRowIndexes})
  }

  updatInterfaceModal = (rowIndex) => {
    let data = this.state.nodes
    let itemData = {}
    data.map((datum) => {
      datum.allInterfaces.map((interfaceItem, datumIndex) => {
        if (rowIndex === datumIndex) {
          itemData = interfaceItem
        }
      })
    })
    this.setState({ displayModel: !this.state.displayModel, interfaceData: itemData, interfaceIndex: rowIndex })
  }

  checkBoxClick = (e) => {
    console.log('have fun', e)
  }

  renderUpdateInterface() {
    if (this.state.displayModel) {
      let data = this.state.interfaceData
      return (
        <ModalComponent getData={this.updateNodeCall} actionButton={'Update'} data={data} ></ModalComponent>
      );
    }
  }

  updateNodeCall = (params) => {
    let data = this.state.nodes
    data.map((datum) => {
      datum.allInterfaces.map((interfaceItem, rowIndex) => {
        if (rowIndex === this.state.interfaceIndex) {
          interfaceItem.port = params.port
          interfaceItem.IPAddress = params.IPAddress
          interfaceItem.connectedTo.serverName = params.connectedTo.serverName
          interfaceItem.connectedTo.serverPort = params.connectedTo.serverPort
          interfaceItem.isMngmntIntf = params.isMngmntIntf
        }
      })
      this.setState({ interfaces: datum.allInterfaces })
    })
    this.setState({ displayModel: !this.state.displayModel, saveBtn: false })
    NotificationManager.success('Updated Successfully', 'Interface');
  }

  closeInterfaceModal = () => {
    this.setState({ displayNewInterfaceModel: false })
  }

  renderAddInterface() {
    if (this.state.displayNewInterfaceModel) {
      return (
        <ModalComponent cancel={() => this.closeInterfaceModal()} getData={this.updateNewInterfaceCall} actionButton={'Add'}></ModalComponent>
      );
    }
  }

  updateNewInterfaceCall = (params) => {
    let newInterface = {
      'connectedTo': {
        'serverName': params.serverName,
        'serverPort': params.serverPort
      },
      'IPAddress': params.IPAddress,
      'port': params.port,
      'isMngmntIntf': params.isMngmntIntf,
    }
    let data = this.state.nodes
    let datum = data[0]
    let allInterfaces = datum.allInterfaces
    if (!allInterfaces || !allInterfaces.length) {
      allInterfaces = []
    }
    allInterfaces.push(newInterface)
    data[0].allInterfaces = allInterfaces
    this.setState({ displayNewInterfaceModel: !this.state.displayNewInterfaceModel, nodes: data, interfaces: allInterfaces, saveBtn: false })
    NotificationManager.success('Saved Successfully', 'Interface');
  }

  toggleProvisionModel() {
    this.setState({ displayProvisionModel: !this.state.displayProvisionModel })
  }

  provisionModal() {
    if (this.state.displayProvisionModel) {
      return (<ConfirmationModal actionName={'Provision'} open={true}></ConfirmationModal>)
    }
  }

  updateSaveNode = () => {
    let roles = [];
    if (this.state.selectedRoles.length == 0) {
      NotificationManager.error('Role cannot be empty', 'Role');
      return;
    }

    this.state.selectedRoles.map((data) => (roles.push(data.Id)))
    let data = this.state.nodes
    data.map((datum) => {
      datum.roles = roles,
        datum.nodeType = this.state.selectedType,
        datum.linuxIso = this.state.selectedIso,
        datum.kernel = this.state.selectedLinux,
        datum.site = this.state.selectedSite,
        datum.allInterfaces = this.state.interfaces,
        datum.interfaces = this.state.interfaces,
        datum.serialNumber = this.state.selectedSerialNo
      let a = {
        nodes: [datum]
      }
      ServerAPI.DefaultServer().updateNode(this.updateSaveNodeCallback, this, a);
    })
  }

  updateSaveNodeCallback(instance, data) {
    let a = instance.state.data
    if (!a) {
      a = []
    }
    a.push(data)
    instance.setState({ data: a })
    NotificationManager.success('Saved Successfully', 'Node Configuration');
  }

  wipeISO = () => {
    let data = this.state.nodes[0]
    ServerAPI.DefaultServer().upgradeOrWipeServerNode(data, this.wipeCallback, this);
    NotificationManager.success('Wiped Successfully', 'Linux ISO');
    this.setState({ wipeBtn: true })
  }

  wipeCallback(wipeInfo) {
    console.log("Updated :: " + wipeInfo);
  }

  getSelectRoleValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
      opt = options[i];

      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }

  getSelectedData = (data, identity) => {
    if (identity == 'Type') {
      this.setState({ selectedTypeId: data, saveBtn: false })
    }
    if (identity == 'Linux') {
      this.state.selectedLinux != data && data != '' ? this.setState({ rebootBtn: false }) : ''
      this.setState({ selectedLinuxId: data, saveBtn: false })
    }
    if (identity == 'ISO') {
      this.state.selectedIso != data && data != '' ? this.setState({ wipeBtn: false }) : ''
      this.setState({ selectedIso: data, saveBtn: false })
    }
    if (identity == 'Site') {
      this.setState({ selectedSiteId: data, saveBtn: false })
    }

  }

  /*   handleChange = (event) => {
      let selectedRoles = this.state.selectedRoles
      let val = event.target.value
      if (!selectedRoles || !selectedRoles.length) {
        selectedRoles = []
        selectedRoles.push(val)
      } else if (selectedRoles.indexOf(val) > -1) {
        selectedRoles.splice(selectedRoles.indexOf(val), 1)
      } else {
        selectedRoles.push(val)
      }
      this.setState({ selectedRoles: selectedRoles })
    } */


  handleChanges = (selectedOption) => {
    console.log(selectedOption)
    this.setState({ selectedRoles: selectedOption, saveBtn: false });
  }

  serialNo = (e) => {
    this.setState({ selectedSerialNo: e.target.value, saveBtn: false });
  }

  showDiscoverButton = () => {
    let allInterfaces = this.state.interfaces
    let chkDiscoverbtn = null
    if (!allInterfaces || !allInterfaces.length) {
      chkDiscoverbtn = false
    }
    else {
      allInterfaces.map((item) => {
        if (item.isMngmntIntf == true) {
          chkDiscoverbtn = true
        }
      })
    }
    if (chkDiscoverbtn) {
      if (this.state.isLoading) {
        return (<Button className="custFillBtn" outline color="secondary" style={{ cursor: 'wait' }} > Discovering.... </Button >)
      }
      if (!this.state.isLoading) {
        return (<Button className='custBtn' outline color="secondary" onClick={() => (this.discoverModal())
        }> Discover </Button >)
      }

    }
    else {
      return (<Button className="custBtn" outline color="secondary" disabled > Discover </Button>)
    }
  }

  discoverModal = () => {
    this.toggleLoading()
    this.setState({ saveBtn: true })
    let roles = [];
    this.state.selectedRoles.map((data) => (roles.push(data.label)))
    let data = this.state.nodes
    data.map((datum) => {
      datum.roles = roles,
        datum.nodeType = this.state.selectedType,
        datum.linuxIso = this.state.selectedIso,
        datum.kernel = this.state.selectedLinux,
        datum.site = this.state.selectedSite,
        datum.allInterfaces = this.state.interfaces,
        datum.interfaces = this.state.interfaces,
        datum.serialNumber = this.state.selectedSerialNo
      let a = {
        nodes: [datum]
      }
      ServerAPI.DefaultServer().updateNode(this.updateDiscoverNodeCallback, this, a);
    })

  }

  toggleLoading = () => {
    this.setState((prevState, props) => ({
      isLoading: !prevState.isLoading
    }))
  }

  openDiscoverModal = () => {
    if (this.state.openDiscoverModal) {
      return (<DiscoverModal cancel={() => this.closeDiscoverModal()} node={this.state.nodes} actualNode={this.state.actualNode} action={(e) => { this.actualNode(e) }}></DiscoverModal>)
    }

  }

  closeDiscoverModal = (e) => {
    this.setState({ openDiscoverModal: false })
  }


  updateDiscoverNodeCallback(instance, data) {
    let a = instance.state.data
    if (!a) {
      a = []
    }
    a.push(data)
    instance.setState({ data: a })
    instance.fetchActualNode(instance.state.hostname)
  }

  fetchActualNode(nodeName) {
    let self = this
    fetch(invaderServerAddress + '/node/discover/' + nodeName)
      .then(response => response.json())
      .then((data) => {
        self.toggleLoading()
        self.setState({ actualNode: data, openDiscoverModal: true })

      });
  }

  actualNode = (params) => {

    params.allInterfaces.map((parm) => {
      parm.IPAddress = parm.ip
      parm.connectedTo.serverName = parm.connectedTo.name
      parm.connectedTo.serverPort = parm.connectedTo.port
    })
    this.setState({
      selectedType: params.nodeType ? params.nodeType : '',
      selectedIso: params.linuxISO ? params.linuxISO : '',
      selectedLinux: params.kernel ? params.kernel : '',
      interfaces: params.allInterfaces ? params.allInterfaces : [],
      allInterfaces: params.allInterfaces ? params.allInterfaces : [],
      selectedSerialNo: params.serialNumber ? params.serialNumber : '',
      openDiscoverModal: false
    })


    let data = this.state.nodes
    let roles = [];
    this.state.selectedRoles.map((data) => (roles.push(data.label)))
    data.map((datum) => {
      datum.roles = roles,
        datum.nodeType = params.nodeType ? params.nodeType : '',
        datum.linuxIso = params.linuxISO ? params.linuxISO : '',
        datum.kernel = params.kernel ? params.kernel : '',
        datum.allInterfaces = params.allInterfaces ? params.allInterfaces : [],
        datum.interfaces = params.allInterfaces ? params.allInterfaces : [],
        datum.serialNumber = params.serialNumber ? params.serialNumber : ''
      let a = {
        nodes: [datum]
      }
      ServerAPI.DefaultServer().updateNode(this.updateActualNodeCallback, this, a);
    })

  }

  updateActualNodeCallback(instance, data) {
    let a = instance.state.data
    if (!a) {
      a = []
    }
    a.push(data)
    instance.setState({ data: a })
    // instance.setState({ data: a, openDiscoverModal: false })
    NotificationManager.success('Saved Successfully', 'Node Configuration');
  }

  cancelNodeConfig = () => {
    this.setState({ cancelNodeConfig: true })
  }

  render() {
    let { nodes } = this.state
    if (!nodes || !nodes.length) {
      return <div></div>
    }
    if (this.state.cancelNodeConfig) {
      return <Redirect push to={'/pcc/node/NodeConfigSummary'}></Redirect>
    }
    let isSingleNode = this.state.nodes.length === 1 ? true : false
    let nodeNameDiv = null
    let interfaceTableHeader = null
    let interfaceTableContent = null
    let summaryDataTable = null
    let showDiscoverButton = null
    let selectedRowIndexes = []
    if (isSingleNode) {
      nodeNameDiv =
        <div>
          <Media className="edit" id="edit">
            <Media left>
              {this.state.nodes.map((nodeItem) => nodeItem.Name)}
            </Media>
          </Media>
        </div>
      interfaceTableHeader = this.interfaceTableHeader()
      interfaceTableContent = this.interfaceTableContent()
      showDiscoverButton = this.showDiscoverButton()
    } else {
      this.state.nodes.map(function (node, i) {
        selectedRowIndexes.push(i)
      })
      summaryDataTable = <SummaryDataTable data={this.state.nodes} heading={this.state.nodeHead} selectedRowIndexes={selectedRowIndexes} checkBoxClick={this.checkBoxClick} />
    }
    return (
      <div className="animated fadeIn">
        <Media>
          <Media left >
            {nodeNameDiv}
          </Media>
          <Media body><NotificationContainer /></Media>
          <Media right>
            {showDiscoverButton}
            <Button className="custBtn" outline color="secondary" onClick={() => { this.cancelNodeConfig() }}> Cancel </Button>
            <Button className="custBtn" outline color="secondary" disabled={this.state.saveBtn} onClick={() => (this.updateSaveNode())}> Save </Button>
          </Media>
        </Media>
        <div >

          <div className="linuxBox" style={{ marginRight: '20px' }}>
            <Media>
              <Media body>
                <Label>Base Linux ISO</Label>
                <DropDown options={this.state.isoData} getSelectedData={this.getSelectedData} identity={"ISO"} default={this.state.selectedIsoId} />
              </Media>
              <Media right>
                <Button className="custBtn marTop40 marLeft10 " disabled={this.state.wipeBtn} outline color="secondary" onClick={() => { this.wipeISO() }}> Wipe </Button>
              </Media>
            </Media>
          </div>
          <div className="linuxBox">
            <Media>
              <Media body>
                <Label>Linux Kernel</Label>
                <DropDown options={this.state.kernelData} getSelectedData={this.getSelectedData} identity={"Linux"} default={this.state.selectedLinuxId} />
              </Media>
              <Media right>
                <Button className="custBtn marTop40 marLeft10 " disabled={this.state.rebootBtn} outline color="secondary" > Reboot </Button>
              </Media>
            </Media>
          </div>
        </div>
        <div className="boxBorder marTop20">
          <Media>
            <Media body>
            </Media>
            <Media right>
              <Button className="custBtn" outline color="secondary" onClick={() => { this.toggleProvisionModel() }}> Provision </Button>
            </Media>
          </Media>
          <Row className="pad">
            <Col xs='3' ><Label>Roles</Label><br />
              <MultiselectDropDown value={this.state.selectedRoles} getSelectedData={this.handleChanges} options={this.state.roleData} />
            </Col>
            <Col xs='3' ><Label>Type</Label><br />
              <DropDown options={this.state.typeData} getSelectedData={this.getSelectedData} identity={"Type"} default={this.state.selectedTypeId} />
            </Col>
            <Col xs='3' ><Label>Serial Number</Label><br />
              <Input className="marTop10" type="text" value={this.state.selectedSerialNo} onChange={(e) => { this.serialNo(e) }} />
            </Col>
            <Col xs='3' ><Label>Site</Label><br />
              <DropDown options={this.state.siteData} getSelectedData={this.getSelectedData} identity={"Site"} default={this.state.selectedSiteId} />
            </Col>
          </Row>
          {/* {this.confDropdown()} */}
          <div style={{ padding: '10px' }}>
            {interfaceTableHeader}
            {interfaceTableContent}
          </div>
        </div>


        <div className="padTop20">
          {summaryDataTable}
        </div>
        {this.renderUpdateInterface()}
        {this.renderAddInterface()}
        {this.provisionModal()}
        {this.openDiscoverModal()}

      </div>

    )
  }
}

export default NodeConfig;
