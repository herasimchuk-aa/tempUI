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
import { FETCH_ALL_SITES, FETCH_ALL_ROLES, FETCH_ALL_ISOS, FETCH_ALL_KERNELS, FETCH_ALL_SYSTEM_TYPES, UPDATE_NODES, DISCOVER, ADD_KERNEL, ADD_SYSTEM_TYPE, ADD_ISO } from '../../apis/RestConfig';
import { getRequest, postRequest, putRequest } from '../../apis/RestApi';

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
      nodeId: props.location.state[0].Id,
      displayProvisionModel: false,
      actualNode: {},
      wipeBtn: true,
      rebootBtn: true,
      saveBtn: true,
      openDiscoverModal: false,
      cancelNodeConfig: false,
      interfaces: props.location.state[0].interfaces,
      isLoading: false
    }
    this.counter = 0
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
      self.setState({ typeData: typeData, roleData: roleData, kernelData: kernelData, isoData: isoData, siteData: siteData })
    })

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
    let self = this
    let arr = []
    let interfaces = self.state.nodes[0].interfaces
    interfaces.map((interfaceItem, index) => {
      for (let i = 0; i < self.state.selectedRowIndexes.length; i++) {
        if (index == self.state.selectedRowIndexes[i]) {
          arr.push(interfaceItem.Name)
        }
      }
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] == interfaceItem.Name) {
          delete interfaces[index]
        }
      }

    })

    interfaces = interfaces.filter(function (n) { return n != undefined })
    self.state.nodes[0].interfaces = interfaces
    self.setState({ interfaces: interfaces })
    let roles = [];
    if (self.state.selectedRoles && self.state.selectedRoles.length) {
      self.state.selectedRoles.map((data) => (roles.push(data.Id)))
    }

    let data = self.state.nodes
    data.map((datum) => {
      datum.roles = roles,
        datum.Type_Id = parseInt(self.state.selectedTypeId),
        datum.Iso_Id = parseInt(self.state.selectedIsoId),
        datum.Kernel_Id = parseInt(self.state.selectedLinuxId),
        datum.Site_Id = parseInt(self.state.selectedSiteId),
        datum.interfaces = self.state.interfaces,
        datum.SN = self.state.selectedSerialNo


      putRequest(UPDATE_NODES, datum).then(function (data) {

        if (data.StatusCode == 200) {
          let renderedData = self.state.nodes;
          if (!renderedData) {
            renderedData = []
          }
          self.setState({ interfaces: interfaces, selectedRowIndexes: [] })

        }
        else {
          NotificationManager.error("Something went wrong", "node")
        }
      })
    })
  }

  interfaceTableContent() {
    let rows = []
    let self = this
    if (this.state.interfaces && this.state.interfaces.length) {
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

        let row = (<Row className={row1} style={{ marginLeft: '0px', marginRight: '0px' }}>
          <Col sm="1" className="pad" ><Input key={self.counter++} style={{ cursor: 'pointer', marginLeft: '0px' }}
            type="checkbox" onChange={() => (self.checkBoxClickInterface(rowIndex))} defaultChecked={false} /></Col>
          <Col sm="2" className="pad">{item.Name ? item.Name : '-'}</Col>
          <Col sm="2" className="pad">{item.Admin_state ? item.Admin_state : '-'}</Col>
          <Col sm="2" className="pad">{item.Ip_address ? item.Ip_address : '-'}</Col>
          <Col sm="2" className="pad">{item.Remote_node_name ? item.Remote_node_name : '-'}</Col>
          <Col sm="2" className="pad">{item.Remote_interface ? item.Remote_interface : "-"}</Col>
          <Col sm="1" className="pad" style={{ cursor: 'pointer' }}><i className="fa fa-pencil" aria-hidden="true" onClick={() => (self.updatInterfaceModal(item.Id))}></i></Col>

        </Row>)
        rows.push(row)
      })
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
  }

  updatInterfaceModal = (Id) => {
    let interfaceData = this.state.nodes[0].interfaces
    let itemData = {}

    interfaceData.map((interfaceItem) => {
      if (Id === interfaceItem.Id) {
        itemData = interfaceItem
      }
    })

    this.setState({ displayModel: !this.state.displayModel, interfaceData: itemData })
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
      datum.interfaces.map((interfaceItem) => {
        if (interfaceItem.Id === params.Id) {
          interfaceItem.Name = params.Name
          interfaceItem.Ip_address = params.Ip_address
          interfaceItem.Remote_node_name = params.Remote_node_name
          interfaceItem.Remote_interface = params.Remote_interface
          interfaceItem.Is_management_interface = params.Is_management_interface
        }
      })
      this.setState({ interfaces: datum.interfaces })
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
    let data = this.state.nodes
    let datum = data[0]
    let newInterface = {
      'Remote_node_name': params.Remote_node_name,
      'Remote_interface': params.Remote_interface,
      'Ip_address': params.Ip_address,
      'Name': params.Name,
      'Is_management_interface': params.Is_management_interface,
      'Node_Id': datum.Id
    }
    let interfaces = datum.interfaces
    if (!interfaces || !interfaces.length) {
      interfaces = []
    }
    interfaces.push(newInterface)
    data[0].interfaces = interfaces
    this.setState({ displayNewInterfaceModel: !this.state.displayNewInterfaceModel, nodes: data, interfaces: interfaces, saveBtn: false })
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
    let self = this
    if (this.state.selectedRoles.length == 0) {
      NotificationManager.error('Role cannot be empty', 'Role');
      return;
    }
    self.state.selectedRoles.map((data) => (roles.push(data.Id)))
    let data = self.state.nodes
    data.map((datum) => {
      datum.roles = roles,
        datum.Type_Id = parseInt(self.state.selectedTypeId),
        datum.Iso_Id = parseInt(self.state.selectedIsoId),
        datum.Kernel_Id = parseInt(self.state.selectedLinuxId),
        datum.Site_Id = parseInt(self.state.selectedSiteId),
        datum.interfaces = self.state.interfaces,
        datum.SN = self.state.selectedSerialNo


      putRequest(UPDATE_NODES, datum).then(function (data) {
        if (data.StatusCode == 200) {
          let renderedData = self.state.nodes;
          if (!renderedData) {
            renderedData = []
          }
          NotificationManager.success("Node Updated Successfully", "node")
        }
        else {
          NotificationManager.error("Something went wrong", "node")
        }
        self.setState({ displayModel: false, visible: false })
      })
    })
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
      this.state.selectedLinuxId != data && data != '' ? this.setState({ rebootBtn: false }) : ''
      this.setState({ selectedLinuxId: data, saveBtn: false })
    }
    if (identity == 'ISO') {
      this.state.selectedIsoId != data && data != '' ? this.setState({ wipeBtn: false }) : ''
      this.setState({ selectedIsoId: data, saveBtn: false })
    }
    if (identity == 'Site') {
      this.setState({ selectedSiteId: data, saveBtn: false })
    }

  }

  handleChanges = (selectedOption) => {
    this.setState({ selectedRoles: selectedOption, saveBtn: false });
  }

  serialNo = (e) => {
    this.setState({ selectedSerialNo: e.target.value, saveBtn: false });
  }

  showDiscoverButton = () => {
    if (this.state.isLoading) {
      return (<Button className="custFillBtn" outline color="secondary" style={{ cursor: 'wait' }} > Discovering.... </Button >)
    }
    if (!this.state.isLoading) {
      return (<Button className='custBtn' outline color="secondary" onClick={() => (this.discoverModal())
      }> Discover </Button >)
    }

  }

  discoverModal = () => {
    let self = this
    self.toggleLoading()
    self.setState({ saveBtn: true })
    let roles = [];
    self.state.selectedRoles.map((data) => (roles.push(data.Id)))
    let data = self.state.nodes
    data.map((datum) => {
      datum.roles = roles,
        datum.Type_Id = parseInt(self.state.selectedTypeId),
        datum.Iso_Id = parseInt(self.state.selectedIsoId),
        datum.Kernel_Id = parseInt(self.state.selectedLinuxId),
        datum.Site_Id = parseInt(self.state.selectedSiteId),
        datum.interfaces = self.state.interfaces,
        datum.SN = self.state.selectedSerialNo

      putRequest(UPDATE_NODES, datum).then(function (data) {
        if (data.StatusCode == 200) {
          let renderedData = self.state.nodes;
          if (!renderedData) {
            renderedData = []
          }
        }
        else {
          NotificationManager.error("Something went wrong", "node")
        }
        self.setState({ displayModel: false, visible: false })
        self.fetchActualNode(self.state.nodeId)
      })
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

  fetchActualNode(nodeId) {
    let self = this
    let node = {}
    node.Id = nodeId
    postRequest(DISCOVER, node)
      .then(function (data) {
        self.toggleLoading()
        self.setState({ actualNode: data.Data, openDiscoverModal: true })

      });
  }

  actualNode = (params) => {
    let self = this
    let kernelId = 0
    let typeId = 0
    let isoId = 0

    let kernels = self.state.kernelData
    let kernelExist = false
    for (let kernel of kernels) {
      if (kernel.Name == params.Kernel) {
        kernelId = kernel.Id
        kernelExist = true
        break
      }
    }
    let kernelPro
    if (!kernelExist) {
      if (params.Kernel) {
        let dataparams = {
          'Name': params.Kernel
        }
        kernelPro = postRequest(ADD_KERNEL, dataparams).then(function (data) {
          if (data.StatusCode == 200) {
            let renderedData = self.state.kernelData;
            if (!renderedData) {
              renderedData = []
            }
            kernelId = data.Data.Id
            renderedData.push(data.Data)
            self.setState({ kernelData: renderedData })
          }
          else {
            NotificationManager.error("Something went wrong", "Kernel")
          }
        })
      } else {
        kernelId = 0
      }
    } else {
      kernelPro = Promise.resolve()
    }


    let types = self.state.typeData
    let typeExist = false
    for (let type of types) {
      if (type.Name == params.Type) {
        typeId = type.Id
        typeExist = true
        break
      }
    }
    let typePro
    if (!typeExist) {
      if (params.Type) {
        let dataparams = {
          'Name': params.Type
        }
        typePro = postRequest(ADD_SYSTEM_TYPE, dataparams).then(function (data) {
          if (data.StatusCode == 200) {
            let renderedData = self.state.typeData;
            if (!renderedData) {
              renderedData = []
            }
            typeId = data.Data.Id
            renderedData.push(data.Data)
            self.setState({ typeData: renderedData })
          }
          else {
            NotificationManager.error("Something went wrong", "type")
          }
        })
      } else {
        typeId = 0
      }

    } else {
      typePro = Promise.resolve()
    }



    let isos = self.state.isoData
    let isoExist = false
    for (let iso of isos) {
      if (iso.Name == params.BaseISO) {
        isoId = iso.Id
        isoExist = true
        break
      }
    }
    let isoPro
    if (!isoExist) {
      if (params.BaseISO) {
        let dataparams = {
          'Name': params.BaseISO
        }
        isoPro = postRequest(ADD_ISO, dataparams).then(function (data) {
          if (data.StatusCode == 200) {
            let renderedData = self.state.isoData;
            if (!renderedData) {
              renderedData = []
            }
            isoId = data.Data.Id
            renderedData.push(data.Data)
            self.setState({ isoData: renderedData })
          }
          else {
            NotificationManager.error("Something went wrong", "iso")
          }
        })
      } else {
        isoId = 0
      }

    } else {
      isoPro = Promise.resolve()
    }

    Promise.all([kernelPro, typePro, isoPro]).then(function () {
      params.interfaces.map((item) => {
        item.Node_Id = self.state.nodeId
      })
      self.setState({
        selectedTypeId: typeId,
        selectedIsoId: isoId,
        selectedLinuxId: kernelId,
        selectedSiteId: params.Site_Id,
        interfaces: params.interfaces ? params.interfaces : [],
        selectedSerialNo: params.SerialNumber ? params.SerialNumber : params.SN ? params.SN : '',
        openDiscoverModal: false
      })

    }).then(function () {
      let data = self.state.nodes
      let roles = [];
      if (self.state.selectedRoles && self.state.selectedRoles.length) {
        self.state.selectedRoles.map((data) => (roles.push(data.Id)))
      }
      data.map((datum) => {
        datum.roles = roles,
          datum.Type_Id = parseInt(typeId),
          datum.Iso_Id = parseInt(isoId),
          datum.Kernel_Id = parseInt(kernelId),
          datum.Site_Id = parseInt(self.state.selectedSiteId),
          datum.interfaces = params.interfaces,
          datum.SN = params.SerialNumber ? params.SerialNumber : params.SN ? params.SN : '',

          putRequest(UPDATE_NODES, datum).then(function (data) {
            if (data.StatusCode == 200) {
              let renderedData = self.state.nodes;
              if (!renderedData) {
                renderedData = []
              }
            }
            else {
              NotificationManager.error("Something went wrong", "node")
            }
            self.setState({ displayModel: false, visible: false })
          })
      })
    })


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
