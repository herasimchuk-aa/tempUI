import React, { Component } from 'react';
import { Row, Col, Button, Label, Media, Input } from 'reactstrap';
import SummaryDataTable from './NodeSummary/SummaryDataTable';
import { Redirect } from 'react-router-dom';
import '../views.css';
import { nodeHead } from '../../consts';
import DropDown from '../../components/dropdown/DropDown';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import MultiselectDropDown from '../../components/MultiselectDropdown/MultiselectDropDown';
import ProvisionProgress from '../../components/ProvisionProgress/ProvisionProgress';
import DiscoverModal from '../../components/DiscoverModal/DiscoverModal';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { ROLLBACK_PROVISION, UPDATE_NODES, DISCOVER, ADD_KERNEL, ADD_SYSTEM_TYPE, ADD_ISO, ADD_GOES, ADD_IPROUTE, ADD_LLDP, ADD_ETHTOOL, FETCH_ALL_GOES, FETCH_ALL_FRR, FETCH_ALL_IPROUTE, FETCH_ALL_LLDP, FETCH_ALL_ETHTOOL, PROVISION } from '../../apis/RestConfig';
import Interfaces from './interfaces';
import { connect } from 'react-redux';
import I from 'immutable'
import { fetchFecs } from '../../actions/fecAction';
import { fetchMedias } from '../../actions/mediaAction';
import { fetchSpeeds } from '../../actions/speedAction';
import { getEthTool, addEthTool } from '../../actions/ethToolAction';
import { getLLDP, addLLDP } from '../../actions/lldpAction';
import { getGoes, addGoes } from '../../actions/goesAction';
import { getIpRoute, addIpRoutes } from '../../actions/ipRouteAction';
import { updateNode, provisionNode, fetchActualNode, rollbackProvision } from '../../actions/nodeAction';
import { addKernels } from '../../actions/kernelAction';
import { addTypes } from '../../actions/systemTypeAction';
import { addISOs } from '../../actions/baseIsoActions';
import { getFrr } from '../../actions/frrAction';

class NodeConfig extends Component {


  /*------------------------------------------------------------Life Cycle Functions-------------------------------------------------------*/

  constructor(props) {
    super(props);
    this.state = {
      nodeHead: nodeHead,
      displayProvisionModel: false,
      displayConfirmationModel: false,
      wipeBtn: true,
      rebootBtn: true,
      saveBtn: true,
      openDiscoverModal: false,
      cancelNodeConfig: false,
      isLoading: false
    }
    this.counter = 0
  }

  static getDerivedStateFromProps(props) {
    let { selectedNodes, roleData, kernelData, typeData, siteData, goesData, ipRouteData, frrData, lldpData, ethToolData, speedData, fecData, mediaData, isoData, actualNode } = props
    return {
      nodes: selectedNodes ? selectedNodes.toJS() : [],
      actualNode: actualNode ? actualNode.toJS() : {},
      selectedRoles: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'roleDetails'], I.List()).toJS() : '',
      selectedSerialNo: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'SN']) : '',
      selectedTypeId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Type_Id']) : '',
      selectedLinuxId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Kernel_Id']) : '',
      selectedIsoId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Iso_Id']) : '',
      selectedSiteId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Site_Id']) : '',
      selectedGoesId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Goes_Id']) : '',
      selectedIpRouteId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Iproute_Id']) : '',
      selectedFrrId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Frr_Id']) : '',
      selectedLldpId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Lldp_Id']) : '',
      selectedEthToolId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Ethtool_Id']) : '',
      roleData: roleData ? roleData.toJS() : [],
      isoData: isoData ? isoData.toJS() : [],
      kernelData: kernelData ? kernelData.toJS() : [],
      typeData: typeData ? typeData.toJS() : [],
      siteData: siteData ? siteData.toJS() : [],
      goesData: goesData ? goesData.toJS() : [],
      ipRouteData: ipRouteData ? ipRouteData.toJS() : [],
      frrData: frrData ? frrData.toJS() : [],
      lldpData: lldpData ? lldpData.toJS() : [],
      ethToolData: ethToolData ? ethToolData.toJS() : [],
      speedData: speedData ? speedData.toJS() : [],
      fecData: fecData ? fecData.toJS() : [],
      mediaData: mediaData ? mediaData.toJS() : [],
    }
  }

  componentDidMount() {
    this.initRequests()
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
    let summaryDataTable = null
    let showDiscoverButton = null
    let showProvisionRollback = null
    let selectedRowIndexes = []
    let interfaceDiv = null
    if (isSingleNode) {
      nodeNameDiv =
        <div>
          <Media className="edit" id="edit">
            <Media left>
              {this.state.nodes.map((nodeItem) => nodeItem.Name)} / <small>HOST : {this.state.nodes.map((nodeItem) => nodeItem.Host)}</small>
            </Media>
          </Media>
        </div>
      showDiscoverButton = this.showDiscoverButton()
      showProvisionRollback = this.showProvisionRollback()
      interfaceDiv = <Interfaces data={this.state.nodes} speedData={this.state.speedData} fecData={this.state.fecData} mediaData={this.state.mediaData} update={this.updateInterfaces} ></Interfaces>
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
            {showProvisionRollback}
            {showDiscoverButton}
            <Button className="custBtn" outline color="secondary" onClick={() => { this.cancelNodeConfig() }}> Cancel </Button>
            <Button className="custBtn" outline color="secondary" disabled={this.state.saveBtn} onClick={() => (this.updateNode())}> Save </Button>
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
                <Button className="custBtn marTop40 marLeft10 " disabled={this.state.rebootBtn} outline color="secondary" onClick={() => { this.onRebootClick() }}> Reboot </Button>
              </Media>
            </Media>
          </div>
        </div>
        <div className="boxBorder marTop20">
          <Media>
            <Media body>
            </Media>
            <Media right>
              <Button className="custBtn" outline color="secondary" onClick={() => { this.onProvisionClick() }}> Provision </Button>
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
          <Row className="pad">
            <Col xs='3'><Label>Goes</Label><br />
              <DropDown options={this.state.goesData} getSelectedData={this.getSelectedData} identity={"Goes"} default={this.state.selectedGoesId} />
            </Col>
            <Col xs='3'><Label>LLDP</Label><br />
              <DropDown options={this.state.lldpData} getSelectedData={this.getSelectedData} identity={"Lldp"} default={this.state.selectedLldpId} />
            </Col>
            <Col xs='3'><Label>Ethtool</Label><br />
              <DropDown options={this.state.ethToolData} getSelectedData={this.getSelectedData} identity={"EthTool"} default={this.state.selectedEthToolId} />
            </Col>
            <Col xs='3'><Label>IpRoute2</Label><br />
              <DropDown options={this.state.ipRouteData} getSelectedData={this.getSelectedData} identity={'IpRoute'} default={this.state.selectedIpRouteId} />
            </Col>
          </Row>
          <Row className="pad">
            <Col xs='3'><Label>FRR</Label><br />
              <DropDown options={this.state.frrData} getSelectedData={this.getSelectedData} identity={'Frr'} default={this.state.selectedFrrId} />
            </Col>
            <Col xs='9'><Label>Provision :</Label><br />
              <div className="equiSpace">
                <div><input type="checkbox" id="provisionGoes" defaultChecked={false} /> Goes </div>
                <div><input type="checkbox" id="provisionLldp" defaultChecked={false} /> LLDP </div>
                <div><input type="checkbox" id="provisionEthtool" defaultChecked={false} /> Ethtool </div>
                <div><input type="checkbox" id="provisionFrr" defaultChecked={false} /> FRR </div>
                <div><input type="checkbox" id="provisionIpRoute" defaultChecked={false} /> Iproute2 </div>
                <div><input type="checkbox" id="provisionInterfaces" defaultChecked={false} /> Interfaces </div>
              </ div>
            </Col>
          </Row>
          <div style={{ padding: '10px' }}>
            {interfaceDiv}
          </div>
        </div>
        <div className="padTop50">
          {summaryDataTable}
        </div>
        {this.provisionModal()}
        {this.confirmationModal()}
        {this.openDiscoverModal()}
        {this.confirmationModalWipe()}
        {this.rollbackConfirmationModal()}
      </div>

    )
  }

  /*--------------------------------------------------------------------------------------------------------------------------------------*/


  /*--------------------------------------------------------Class Main Functions---------------------------------------------------------*/

  initRequests = () => {
    this.props.fetchEthTool(FETCH_ALL_ETHTOOL)
    this.props.fetchGoes(FETCH_ALL_GOES)
    this.props.fetchFrr(FETCH_ALL_FRR)
    this.props.fetchIpRoute(FETCH_ALL_IPROUTE)
    this.props.fetchLLDP(FETCH_ALL_LLDP)
    this.props.fetchFecs()
    this.props.fetchMedias()
    this.props.fetchSpeeds()
  }

  updateNode = () => {
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
        datum.Goes_Id = parseInt(self.state.selectedGoesId),
        datum.Frr_Id = parseInt(self.state.selectedFrrId),
        datum.Iproute_Id = parseInt(self.state.selectedIpRouteId),
        datum.Lldp_Id = parseInt(self.state.selectedLldpId),
        datum.Ethtool_Id = parseInt(self.state.selectedEthToolId),
        datum.interfaces = self.state.nodes[0].interfaces,
        datum.SN = self.state.selectedSerialNo

      self.props.updateNode(UPDATE_NODES, datum).then(function () {
        NotificationManager.success("Node Updated Successfully", "Node")
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "Node")
      })
    })
  }

  //update node from interface component
  updateInterfaces = (...args) => {
    let self = this
    if (args[1] == 'delete') {

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
          datum.interfaces = args[0].interfaces.length ? args[0].interfaces : [null],
          datum.SN = self.state.selectedSerialNo


        self.props.updateNode(UPDATE_NODES, datum).then(function () {
          NotificationManager.success("Node Updated Successfully", "node")
          self.setState({ saveBtn: false })
        }).catch(function (err) {
          NotificationManager.error("Something went wrong", "Node")
        })
      })
    } else {
      let nodeData = []
      nodeData.push(args[0])
      self.setState({ nodes: nodeData, saveBtn: false })
    }
  }

  /*---------------------------------------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------Click Handler Functions-------------------------------------------------------------------*/

  onProvisionClick() {
    if (!document.getElementById('provisionGoes').checked && !document.getElementById('provisionLldp').checked &&
      !document.getElementById('provisionEthtool').checked && !document.getElementById('provisionInterfaces').checked
      && !document.getElementById('provisionFrr').checked) {
      alert("Please select an App to provision")
      return
    }
    let self = this
    let provisiondata = Object.assign({}, {
      'NodeId': self.state.nodes[0].Id,
      'role': 'cloud-node',
      'items': {
        'goes': document.getElementById('provisionGoes').checked,
        'lldp': document.getElementById('provisionLldp').checked,
        'ethtool': document.getElementById('provisionEthtool').checked,
        'interfaces': document.getElementById('provisionInterfaces').checked,
        'iproute': document.getElementById('provisionIpRoute').checked,
        'frr': document.getElementById('provisionFrr').checked
      }
    })

    self.props.provisionNode(PROVISION, provisiondata).then(function (data) {
      self.setState({ displayConfirmationModel: true })
    }).catch(function (e) {
      console.log(e)
      NotificationManager.error("Something went wrong", "Provision")
    })
  }

  rollbackProvion() {
    let self = this
    self.setState({ displayRollbackConfirmationModel: true })
  }

  rollbackConfirmationModal() {
    if (this.state.displayRollbackConfirmationModel) {
      return <ConfirmationModal open={true} actionName={'Rollback'} cancel={() => this.closeRollbackConfirmationModel()} action={() => this.rollbackProvisionCall()} />
    }
  }

  closeRollbackConfirmationModel() {
    this.setState({ displayRollbackConfirmationModel: false })
  }

  rollbackProvisionCall() {
    let self = this
    let provisiondata = Object.assign({}, {
      'NodeId': self.state.nodes[0].Id,
      'role': 'cloud-node',
    })

    self.props.rollbackProvision(ROLLBACK_PROVISION, provisiondata).then(function (data) {
      console.log(data)
      self.setState({ displayRollbackConfirmationModel: false })
      NotificationManager.success("Provision Reverted successfully", "Provision Rollback")
    }).catch(function (e) {
      console.log(e)
      NotificationManager.error("Something went wrong", "Provision Rollback")
    })
  }

  onRebootClick() {
    let self = this
    let provisiondata = Object.assign({}, {
      'NodeId': self.state.nodes[0].Id,
      'role': 'cloud-node',
      'items': {
        'goes': false,
        'lldp': false,
        'ethtool': false,
        'kernel': true,
        'interfaces': false,
        'iproute': false,
        'frr': false
      }
    })

    self.props.provisionNode(PROVISION, provisiondata).then(function (data) {
      self.setState({ displayConfirmationModel: true })
    }).catch(function (e) {
      console.log(e)
      NotificationManager.error("Something went wrong", "Provision")
    })
  }

  wipeISO = () => {
    this.setState({ displayConfirmationModelForWipe: true })
  }

  confirmationModalWipe() {
    if (this.state.displayConfirmationModelForWipe) {
      return <ConfirmationModal open={true} actionName={'Wipe'} cancel={() => this.closeConfirmationModalWipe()} action={() => this.startProvision()} />
    }
  }

  closeConfirmationModalWipe = () => {
    this.setState({ displayConfirmationModelForWipe: false })
  }

  handleChanges = (selectedOption) => {
    this.setState({ selectedRoles: selectedOption, saveBtn: false });
  }

  cancelNodeConfig = () => {
    this.setState({ cancelNodeConfig: true })
  }


  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  /*------------------------------------------------------Modal Componets-----------------------------------------------------------------*/

  provisionModal() {
    if (this.state.displayProvisionModel) {
      return <ProvisionProgress cancelPro={() => this.closeProvisionModal()} node={this.state.nodes[0]} />
    }
  }

  confirmationModal() {
    if (this.state.displayConfirmationModel) {
      return <ConfirmationModal open={true} actionName={'Provision'} cancel={() => this.closeConfirmationModal()} action={() => this.startProvision()} />
    }
  }

  startProvision() {
    this.setState({ displayConfirmationModel: false, displayConfirmationModelForWipe: false, displayProvisionModel: true })
  }

  closeConfirmationModal = () => {
    this.setState({ displayConfirmationModel: false })
  }

  closeProvisionModal = () => {
    this.setState({ displayProvisionModel: false })
  }

  openDiscoverModal = () => {
    if (this.state.openDiscoverModal) {
      return (<DiscoverModal cancel={() => this.closeDiscoverModal()} isOpen={true} node={this.state.nodes} actualNode={this.state.actualNode} action={(e) => { this.actualNode(e) }} />)
    }
  }

  closeDiscoverModal = () => {
    console.log('close openDiscoverModal')
    this.setState({ openDiscoverModal: false })
  }

  showDiscoverButton = () => {
    if (this.state.isLoading) {
      return (<Button className="custFillBtn" outline color="secondary" style={{ cursor: 'wait' }} > Discovering.... </Button >)
    }
    return (<Button className='custBtn' outline color="secondary" onClick={() => (this.discoverModal())}> Discover </Button >)
  }

  showProvisionRollback = () => {
    if(this.state.nodes[0].executionStatusObj){
      return (<Button className="custBtn" outline color="secondary" onClick={() => (this.rollbackProvion())} > Rollback Provision </Button >)
    }else{
      return (<Button className="custBtn" outline color="secondary" disabled > Rollback Provision </Button >)
    }
   
  }

  discoverModal = () => {
    let self = this
    self.setState({ saveBtn: true, isLoading: true })
    let roles = [];
    self.state.selectedRoles.map((data) => (roles.push(data.Id)))
    let data = self.state.nodes
    data.map((datum) => {
      datum.roles = roles,
        datum.Type_Id = parseInt(self.state.selectedTypeId),
        datum.Iso_Id = parseInt(self.state.selectedIsoId),
        datum.Kernel_Id = parseInt(self.state.selectedLinuxId),
        datum.Site_Id = parseInt(self.state.selectedSiteId),
        datum.interfaces = datum.interfaces,
        datum.SN = self.state.selectedSerialNo

      self.props.updateNode(UPDATE_NODES, datum).then(function () {
        self.props.fetchActualNode(DISCOVER, datum.Id).then(function () {
          self.setState({ openDiscoverModal: true, isLoading: false })
        })
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "Node")
      })
    })
  }

  /*--------------------------------------------------------------------------------------------------------------------------------------*/

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
      return
    }
    if (identity == 'Linux') {
      this.state.selectedLinuxId != data && data != '' ? this.setState({ rebootBtn: false }) : ''
      this.setState({ selectedLinuxId: data, saveBtn: false })
      return
    }
    if (identity == 'ISO') {
      this.state.selectedIsoId != data && data != '' ? this.setState({ wipeBtn: false }) : ''
      this.setState({ selectedIsoId: data, saveBtn: false })
      return
    }
    if (identity == 'Site') {
      this.setState({ selectedSiteId: data, saveBtn: false })
      return
    }
    if (identity == 'Goes') {
      this.setState({ selectedGoesId: data, saveBtn: false })
      return
    }
    if (identity == 'Frr') {
      this.setState({ selectedFrrId: data, saveBtn: false })
      return
    }
    if (identity == 'IpRoute') {
      this.setState({ selectedIpRouteId: data, saveBtn: false })
      return
    }
    if (identity == 'Lldp') {
      this.setState({ selectedLldpId: data, saveBtn: false })
      return
    }
    if (identity == 'EthTool') {
      this.setState({ selectedEthToolId: data, saveBtn: false })
      return
    }
  }

  serialNo = (e) => {
    this.setState({ selectedSerialNo: e.target.value, saveBtn: false });
  }



  actualNode = (params) => {
    let self = this
    let kernelId = 0
    let typeId = 0
    let isoId = 0

    let goesId = 0
    let lldpId = 0
    let iprouteId = 0
    let ethtoolId = 0

    let kernels = self.state.kernelData
    let kernelExist = false
    for (let kernel of kernels) {
      if (kernel.Name == params.Kernel) {
        kernelId = kernel.Id
        kernelExist = true
        break
      }
    }
    let watingPromise = []
    if (!kernelExist && params.Kernel) {
      let dataparams = {
        'Name': params.Kernel
      }
      let kernelPro = this.props.addKernels(ADD_KERNEL, dataparams).then(function (data) {
        let payload = data.payload
        if (payload && payload.size) {
          for (let kernel of payload) {
            if (kernel.get('Name') === params.Kernel) {
              kernelId = kernel.get('Id')
            }
          }
        }
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "Kernel")
      })
      watingPromise.push(kernelPro)
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
    if (!typeExist && params.Type) {
      let dataparams = {
        'Name': params.Type
      }
      let typePro = this.props.addTypes(ADD_SYSTEM_TYPE, dataparams).then(function (data) {
        let payload = data.payload
        if (payload && payload.size) {
          for (let type of payload) {
            if (type.get('Name') === params.Type) {
              typeId = type.get('Id')
            }
          }
        }
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "Type")
      })
      watingPromise.push(typePro)
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
    if (!isoExist && params.BaseISO) {
      let dataparams = {
        'Name': params.BaseISO
      }
      let isoPro = this.props.addISOs(ADD_ISO, dataparams).then(function (data) {
        let payload = data.payload
        if (payload && payload.size) {
          for (let iso of payload) {
            if (iso.get('Name') === params.BaseISO) {
              isoId = iso.get('Id')
            }
          }
        }
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "Type")
      })
      watingPromise.push(isoPro)
    }
    let goes = self.state.goesData
    let goesExist = false
    for (let go of goes) {
      if (go.Version == params.GoesVersion) {
        goesId = go.Id
        goesExist = true
        break
      }
    }
    if (!goesExist && params.GoesVersion) {
      let dataparams = {
        'Name': 'Goes-' + params.GoesVersion,
        'Version': params.GoesVersion
      }
      let goPro = this.props.addGoes(ADD_GOES, dataparams).then(function (data) {
        let payload = data.payload
        if (payload && payload.size) {
          for (let go of payload) {
            if (go.get('Version') === params.GoesVersion) {
              goesId = go.get('Id')
            }
          }
        }
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "Goes")
      })
      watingPromise.push(goPro)
    }

    let lldps = self.state.lldpData
    let lldpExist = false
    for (let lldp of lldps) {
      if (lldp.Version == params.LldpVersion) {
        lldpId = lldp.Id
        lldpExist = true
        break
      }
    }
    if (!lldpExist && params.LldpVersion) {
      let dataparams = {
        'Name': 'lldp-' + params.LldpVersion,
        'Version': params.LldpVersion
      }
      let lldpPro = this.props.addLLDP(ADD_LLDP, dataparams).then(function (data) {
        let payload = data.payload
        if (payload && payload.size) {
          for (let lldp of payload) {
            if (lldp.get('Version') === params.LldpVersion) {
              lldpId = lldp.get('Id')
            }
          }
        }
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "LLDP")
      })
      watingPromise.push(lldpPro)
    }

    let ethtools = self.state.ethToolData
    let ethtoolExist = false
    for (let ethtool of ethtools) {
      if (ethtool.Version == params.EthtoolVersion) {
        ethtoolId = ethtool.Id
        ethtoolExist = true
        break
      }
    }
    if (!ethtoolExist && params.EthtoolVersion) {
      let dataparams = {
        'Name': 'lldp-' + params.EthtoolVersion,
        'Version': params.EthtoolVersion
      }
      let ethtoolPro = this.props.addEthTool(ADD_ETHTOOL, dataparams).then(function (data) {
        let payload = data.payload
        if (payload && payload.size) {
          for (let ethtool of payload) {
            if (ethtool.get('Version') === params.EthtoolVersion) {
              ethtoolId = ethtool.get('Id')
            }
          }
        }
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "Ethtool")
      })
      watingPromise.push(ethtoolPro)
    }

    let ipRoutes = self.state.ipRouteData
    let ipRouteExist = false
    for (let iproute of ipRoutes) {
      if (iproute.Version == params.IprouteVersion) {
        iprouteId = iproute.Id
        ipRouteExist = true
        break
      }
    }
    if (!ipRouteExist && params.IprouteVersion) {
      let dataparams = {
        'Name': params.IprouteVersion,
        'Version': params.IprouteVersion
      }
      let iproutePro = this.props.addIpRoutes(ADD_IPROUTE, dataparams).then(function (data) {
        let payload = data.payload
        if (payload && payload.size) {
          for (let iproute of payload) {
            if (iproute.get('Version') === params.IprouteVersion) {
              iprouteId = iproute.get('Id')
            }
          }
        }
      }).catch(function (e) {
        console.log(e)
        NotificationManager.error("Something went wrong", "IpRoute")
      })
      watingPromise.push(iproutePro)
    }

    Promise.all(watingPromise).then(function () {
      params.interfaces.map((item) => {
        item.Node_Id = self.state.nodes[0].Id
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
          datum.interfaces = params.interfaces,
          datum.Goes_Id = parseInt(goesId),
          datum.Lldp_Id = parseInt(lldpId),
          datum.Ethtool_Id = parseInt(ethtoolId),
          datum.Iproute_Id = parseInt(iprouteId),
          datum.SN = params.SerialNumber ? params.SerialNumber : params.SN ? params.SN : '',

          self.props.updateNode(UPDATE_NODES, datum).then(function () {
            NotificationManager.success("Node Updated Successfully", "Node")
          }).catch(function (e) {
            console.log(e)
            NotificationManager.error("Something went wrong", "Node")
          })
      })
    })
  }

}

function mapStateToProps(state) {
  let selectedNodeIds = state.nodeReducer.getIn(['selectedNodeIds'])
  let nodes = state.nodeReducer.getIn(['nodes'])
  let selectedNodes = I.List()
  if (selectedNodeIds && selectedNodeIds.size && nodes && nodes.size) {
    selectedNodeIds.map(function (id) {
      for (let node of nodes) {
        if (node.get('Id') === id) {
          selectedNodes = selectedNodes.push(node)
          break
        }
      }
    })
  }
  return {
    actualNode: state.nodeReducer.getIn(['actualNode']),
    selectedNodes: selectedNodes,
    roleData: state.roleReducer.getIn(['roles']),
    isoData: state.baseISOReducer.getIn(['isos']),
    kernelData: state.kernelReducer.getIn(['kernels']),
    typeData: state.systemTypeReducer.getIn(['types']),
    siteData: state.siteReducer.getIn(['sites']),
    goesData: state.goesReducer.getIn(['goes']),
    ipRouteData: state.ipRouteReducer.getIn(['ipRoutes']),
    frrData: state.frrReducer.getIn(['frr']),
    lldpData: state.lldpReducer.getIn(['lldps']),
    ethToolData: state.ethToolReducer.getIn(['ethTools']),
    speedData: state.speedReducer.getIn(['speeds']),
    fecData: state.fecReducer.getIn(['fecs']),
    mediaData: state.mediaReducer.getIn(['medias']),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFecs: () => dispatch(fetchFecs()),
    fetchMedias: () => dispatch(fetchMedias()),
    fetchSpeeds: () => dispatch(fetchSpeeds()),
    fetchEthTool: (url) => dispatch(getEthTool(url)),
    fetchLLDP: (url) => dispatch(getLLDP(url)),
    fetchGoes: (url) => dispatch(getGoes(url)),
    fetchFrr: (url) => dispatch(getFrr(url)),
    fetchIpRoute: (url) => dispatch(getIpRoute(url)),
    updateNode: (url, params) => dispatch(updateNode(url, params)),
    provisionNode: (url, params) => dispatch(provisionNode(url, params)),
    rollbackProvision: (url, params) => dispatch(rollbackProvision(url, params)),
    fetchActualNode: (url, params) => dispatch(fetchActualNode(url, params)),
    addKernels: (url, params) => dispatch(addKernels(url, params)),
    addTypes: (url, params) => dispatch(addTypes(url, params)),
    addISOs: (url, params) => dispatch(addISOs(url, params)),
    addGoes: (url, params) => dispatch(addGoes(url, params)),
    addLLDP: (url, params) => dispatch(addLLDP(url, params)),
    addEthTool: (url, params) => dispatch(addEthTool(url, params)),
    addIpRoutes: (url, params) => dispatch(addIpRoutes(url, params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeConfig);
