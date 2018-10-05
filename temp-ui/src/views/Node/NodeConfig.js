import React, { Component } from 'react';
import { Row, Col, Button, Label, Media, Input } from 'reactstrap';
import { ServerAPI, Group } from '../../ServerAPI';
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
import { UPDATE_NODES, DISCOVER, ADD_KERNEL, ADD_SYSTEM_TYPE, ADD_ISO, FETCH_ALL_GOES, FETCH_ALL_LLDP, FETCH_ALL_ETHTOOL, PROVISION, FETCH_ALL_SPEEDS, FETCH_ALL_FECS, FETCH_ALL_MEDIAS } from '../../apis/RestConfig';
import { getRequest, postRequest, putRequest } from '../../apis/RestApi';
import Interfaces from './interfaces';
import { connect } from 'react-redux';
import I from 'immutable'
import { fetchFecs } from '../../actions/fecAction';
import { fetchMedias } from '../../actions/mediaAction';
import { fetchSpeeds } from '../../actions/speedAction';
import { getEthTool } from '../../actions/ethToolAction';
import { getLLDP } from '../../actions/lldpAction';
import { getGoes } from '../../actions/goesAction';

class NodeConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeHead: nodeHead,
      displayProvisionModel: false,
      actualNode: {},
      wipeBtn: true,
      rebootBtn: true,
      saveBtn: true,
      openDiscoverModal: false,
      cancelNodeConfig: false,
      isLoading: false,
      executionId: 0
    }
    this.counter = 0
  }

  componentDidMount() {
    this.initRequests()
  }

  static getDerivedStateFromProps(props) {
    let { selectedNodes, roleData, kernelData, typeData, siteData, goesData, lldpData, ethToolData, speedData, fecData, mediaData, isoData } = props
    return {
      nodes: selectedNodes ? selectedNodes.toJS() : [],
      selectedRoles: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'roleDetails'], I.List()).toJS() : '',
      selectedSerialNo: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'SN']) : '',
      selectedTypeId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Type_Id']) : '',
      selectedLinuxId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Kernel_Id']) : '',
      selectedIsoId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Iso_Id']) : '',
      selectedSiteId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Site_Id']) : '',
      selectedGoesId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Goes_Id']) : '',
      selectedLldpId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Lldp_Id']) : '',
      selectedEthToolId: selectedNodes.size == 1 ? selectedNodes.getIn(['0', 'Ethtool_Id']) : '',
      roleData: roleData ? roleData.toJS() : [],
      isoData: isoData ? isoData.toJS() : [],
      kernelData: kernelData ? kernelData.toJS() : [],
      typeData: typeData ? typeData.toJS() : [],
      siteData: siteData ? siteData.toJS() : [],
      goesData: goesData ? goesData.toJS() : [],
      lldpData: lldpData ? lldpData.toJS() : [],
      ethToolData: ethToolData ? ethToolData.toJS() : [],
      speedData: speedData ? speedData.toJS() : [],
      fecData: fecData ? fecData.toJS() : [],
      mediaData: mediaData ? mediaData.toJS() : [],
    }
  }

  initRequests = () => {
    this.props.fetchEthTool(FETCH_ALL_ETHTOOL)
    this.props.fetchGoes(FETCH_ALL_GOES)
    this.props.fetchLLDP(FETCH_ALL_LLDP)
    this.props.fetchFecs()
    this.props.fetchMedias()
    this.props.fetchSpeeds()
  }


  onProvisionClick() {
    if (!document.getElementById('provisionGoes').checked && !document.getElementById('provisionLldp').checked &&
      !document.getElementById('provisionEthtool').checked && !document.getElementById('provisionInterfaces').checked) {
      alert("Please select an App to provision")
      return
    }
    let self = this
    let provisiondata = Object.assign({}, {
      'nodeId': '',
      'role': '',
      'items': {
        'goes': false,
        'lldp': false,
        'ethtool': false,
        'interfaces': false
      }
    })
    provisiondata.nodeId = self.state.nodeId
    provisiondata.role = 'cloud-node'
    if (document.getElementById('provisionGoes').checked) {
      provisiondata.items.goes = true
    }
    if (document.getElementById('provisionLldp').checked) {
      provisiondata.items.lldp = true
    }
    if (document.getElementById('provisionEthtool').checked) {
      provisiondata.items.ethtool = true
    }
    if (document.getElementById('provisionInterfaces').checked) {
      provisiondata.items.interfaces = true
    }
    postRequest(PROVISION, provisiondata).then(function (data) {
      if (data.StatusCode == 200) {
        if (data && data.Data) {
          let execution_Id = data.Data.Id
          self.setState({ displayProvisionModel: true, executionId: execution_Id })
        }
      }
      else {
        NotificationManager.error("Something went wrong", "Provision")
      }
    });
  }

  provisionModal() {
    if (this.state.displayProvisionModel) {
      return <ProvisionProgress cancelPro={() => this.closeProvisionModal()} openPro={true} executionId={this.state.executionId} key={this.state.executionId}></ProvisionProgress>
    }
  }

  closeProvisionModal = (e) => {
    this.setState({ displayProvisionModel: false })
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
        datum.Lldp_Id = parseInt(self.state.selectedLldpId),
        datum.Ethtool_Id = parseInt(self.state.selectedEthToolId),
        datum.interfaces = self.state.nodes[0].interfaces,
        datum.SN = self.state.selectedSerialNo

      putRequest(UPDATE_NODES, datum).then(function (data) {
        if (data.StatusCode == 200) {
          let node = []
          node.push(data.Data)
          self.setState({ nodes: node })
          NotificationManager.success("Node Updated Successfully", "node")
        }
        else {
          NotificationManager.error("Something went wrong", "node")
        }
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
    if (identity == 'Lldp') {
      this.setState({ selectedLldpId: data, saveBtn: false })
      return
    }
    if (identity == 'EthTool') {
      this.setState({ selectedEthToolId: data, saveBtn: false })
      return
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
      return (<Button className='custBtn' outline color="secondary" onClick={() => (this.discoverModal())}> Discover </Button >)
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
        datum.interfaces = self.state.nodes[0].interfaces,
        datum.SN = self.state.selectedSerialNo

      putRequest(UPDATE_NODES, datum).then(function (data) {
        if (data.StatusCode == 200) {
          let node = []
          node.push(data.Data)
          self.setState({ nodes: node })
        }
        else {
          NotificationManager.error("Something went wrong", "node")
        }
        self.fetchActualNode(self.state.nodes[0].Id)
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
          datum.Site_Id = parseInt(self.state.selectedSiteId),
          datum.interfaces = params.interfaces,
          datum.SN = params.SerialNumber ? params.SerialNumber : params.SN ? params.SN : '',

          putRequest(UPDATE_NODES, datum).then(function (data) {
            if (data.StatusCode == 200) {
              let node = []
              node.push(data.Data)
              self.setState({
                selectedTypeId: data.Data.Type_Id,
                selectedIsoId: data.Data.Iso_Id,
                selectedLinuxId: data.Data.Kernel_Id,
                selectedSiteId: data.Data.Site_Id,
                selectedSerialNo: data.Data.SN,
                openDiscoverModal: false,
                nodes: node,
              })
              NotificationManager.success("Node Discovered Successfully", "node")
            }
            else {
              NotificationManager.error("Something went wrong", "node")
            }
          })
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


        putRequest(UPDATE_NODES, datum).then(function (data) {
          if (data.StatusCode == 200) {
            let node = []
            node.push(data.Data)

            self.setState({ nodes: node, saveBtn: false })
          }
          else {
            NotificationManager.error("Something went wrong", "node")
          }
        })
      })
    } else {
      let nodeData = []
      nodeData.push(args[0])
      self.setState({ nodes: nodeData, saveBtn: false })
    }
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
    let summaryDataTable = null
    let showDiscoverButton = null
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
            <Col><Label>Provision :</Label><br />
              <div className="equiSpace">
                <div><input type="checkbox" id="provisionGoes" defaultChecked={true} /> Goes </div>
                <div><input type="checkbox" id="provisionLldp" defaultChecked={true} /> LLDP </div>
                <div><input type="checkbox" id="provisionEthtool" defaultChecked={true} /> Ethtool </div>
                <div><input type="checkbox" id="provisionInterfaces" defaultChecked={true} /> Interfaces </div>
              </ div>
            </Col>
          </Row>
          <div style={{ padding: '10px' }}>
            {interfaceDiv}
          </div>
        </div>
        <div className="padTop20">
          {summaryDataTable}
        </div>
        {this.provisionModal()}
        {this.openDiscoverModal()}
      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    selectedNodes: state.nodeReducer.getIn(['selectedNodes']),
    roleData: state.roleReducer.getIn(['roles']),
    isoData: state.baseISOReducer.getIn(['isos']),
    kernelData: state.kernelReducer.getIn(['kernels']),
    typeData: state.systemTypeReducer.getIn(['types']),
    siteData: state.siteReducer.getIn(['sites']),
    goesData: state.goesReducer.getIn(['goes']),
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
    fetchGoes: (url) => dispatch(getGoes(url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeConfig);
