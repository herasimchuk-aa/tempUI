import React, { Component } from 'react';
import { Col, Row, Input, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Media } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';
import SummaryDataTable from './SummaryDataTable';
import DropDown from '../../../components/dropdown/DropDown';
import { nodeHead } from '../../../consts';
import '../../views.css';
import { NotificationManager } from 'react-notifications';
import SearchComponent from '../../../components/SearchComponent/SearchComponent';
import MultiselectDropDown from '../../../components/MultiselectDropdown/MultiselectDropDown';
import { trimString, converter, validateIPaddress } from '../../../components/Utility/Utility';
import { FETCH_ALL_NODES, ADD_NODE, DELETE_NODES } from '../../../apis/RestConfig';
import { fetchNodes, addNode, deleteNodes, setSelectedNodeIds } from '../../../actions/nodeAction';
import { connect } from 'react-redux'
import I from 'immutable'

class NodeSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            constNodes: [],
            roleData: [],
            isoData: [],
            siteData: [],
            kernelData: [],
            typedata: [],
            nodeHead: JSON.parse(JSON.stringify(nodeHead)),
            selectedRowIndex: [],
            selectedRows: [],
            displayModel: false,
            visible: false,
            visibleUnique: false,
            showDelete: false,
            redirect: false,
            selectedTypeId: '',
            selectedLinuxId: '',
            selectedIsoId: '',
            selectedSiteId: '',
            selectedRoles: [],
            isSaveLoading: false
        }
    }

    componentDidMount() {
        this.props.fetchNodes(FETCH_ALL_NODES)
    }

    static getDerivedStateFromProps(props) {
        let { roleData, kernelData, typeData, siteData, goesData, lldpData, ethToolData, speedData, fecData, mediaData, isoData } = props
        return {
            nodes: props.nodes ? props.nodes.toJS() : [],
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

    getSelectedData = (data, identity) => {
        if (identity == 'Type') {
            this.setState({ selectedTypeId: data })
            return
        }
        if (identity == 'Linux') {
            this.setState({ selectedLinuxId: data })
            return
        }
        if (identity == 'ISO') {
            this.setState({ selectedIsoId: data })
            return
        }
        if (identity == 'Site') {
            this.setState({ selectedSiteId: data })
            return
        }
    }


    checkBoxClick = (rowIndex, singleRowClick) => {
        if (singleRowClick) {
            let { nodes } = this.state
            let selectedNodeIds = I.List()
            selectedNodeIds = selectedNodeIds.push(I.fromJS(nodes[rowIndex].Id))
            let selectedRows = [nodes[rowIndex]]
            selectedRows[0].roles = converter(nodes[rowIndex].roles);
            this.setState({
                selectedRows, redirect: true
            })
            this.props.setSelectedNodeIds(selectedNodeIds)
            return
        }
        let { selectedRowIndex } = this.state
        let arrayIndex = selectedRowIndex.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndex.splice(arrayIndex, 1)
        } else {
            selectedRowIndex.push(rowIndex)
        }
        if (this.state.selectedRowIndex.length > 0) {
            this.setState({ showDelete: true });
        }
        else {
            this.setState({ showDelete: false });
        }

    }

    onConfigureClick = () => {
        let { nodes, selectedRowIndex } = this.state
        if (selectedRowIndex.length) {
            let selectedNodeIds = I.List()
            selectedRowIndex.map(function (rowIndex) {
                selectedNodeIds = selectedNodeIds.push(nodes[rowIndex].Id)
            })
            this.setState({
                redirect: true
            })
            this.props.setSelectedNodeIds(selectedNodeIds)
        }
    }

    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteNodes())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteNodes() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndex.map(function (item) {
            deleteIds.push(self.state.nodes[item].Id)
        })
        this.props.deleteNodes(DELETE_NODES, deleteIds).then(function () {
            self.setState({ showDelete: false, selectedRowIndex: [] });
        }).catch(function (e) {
            console.log(e)
        })
    }

    handleChanges = (selectedOption) => {
        this.setState({ selectedRoles: selectedOption });
    }

    onDismiss() {
        this.setState({ visible: false, visibleUnique: false });
    }

    addNodeModal() {
        let showAddButton = this.showAddButton()
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.toggleAddNodeModal()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.toggleAddNodeModal()}>Add Node</ModalHeader>
                    <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >
                        {this.state.errMsg}
                    </Alert>
                    <Alert color="danger" isOpen={this.state.visibleUnique} toggle={() => this.onDismiss()} >
                        {this.state.errMsg}
                    </Alert>
                    <ModalBody>
                        <Row>
                            <Col sm="6" className="marTop10">Name<font color="red"><sup>*</sup></font>
                                <Input id='nodeTitle' autoFocus className="marTop10" />
                            </Col>
                            <Col sm="6" className="marTop10">
                                Host<font color="red"><sup>*</sup></font>
                                <Input id='hostInterface' className="marTop10" />
                            </Col>
                            {/* <Input id='site' className="marTop10" /> */}
                        </Row>
                        <Row>
                            <Col sm="6" className="marTop10">Type
                                <DropDown options={this.state.typedata} getSelectedData={this.getSelectedData} identity={"Type"} default={this.state.selectedTypeId} />
                            </Col>
                            <Col sm="6" className="marTop10"> Site
                                <DropDown options={this.state.siteData} getSelectedData={this.getSelectedData} identity={"Site"} default={this.state.selectedSiteId} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="6" className="marTop10">Roles<font color="red"><sup>*</sup></font>
                                <MultiselectDropDown value={this.state.selectedRoles} getSelectedData={this.handleChanges} options={this.state.roleData} />
                            </Col>
                            <Col sm="6" className="marTop10">
                                Serial Number <Input id='nodeSerialNumber' className="marTop10" />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="6" className="marTop10">Linux Kernel
                                <DropDown options={this.state.kernelData} getSelectedData={this.getSelectedData} identity={"Linux"} default={this.state.selectedLinuxId} />
                            </Col>
                            <Col sm="6" className="marTop10">Base Linux ISO
                                <DropDown options={this.state.isoData} getSelectedData={this.getSelectedData} identity={"ISO"} default={this.state.selectedIsoId} />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {showAddButton}
                        <Button outline color="primary" className="custBtn" onClick={() => (this.toggleAddNodeModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    toggleLoading = () => {
        this.setState((prevState, props) => ({
            isSaveLoading: !prevState.isSaveLoading
        }))
    }

    showAddButton = () => {
        if (this.state.isSaveLoading) {
            return (<Button className="custFillBtn" outline color="secondary" style={{ cursor: 'wait' }} > Adding.... </Button >)
        }
        if (!this.state.isSaveLoading) {
            return (<Button className='custBtn' outline color="secondary" onClick={() => (this.addNode())
            }> Add </Button >)
        }
    }

    addNode() {
        let nodeTitle = document.getElementById('nodeTitle').value
        let name = trimString(nodeTitle)

        let host = document.getElementById('hostInterface').value
        let validIp = validateIPaddress(host)
        if (!validIp) {
            this.setState({ visible: true, errMsg: "Please add valid IP Address in HOST field" })
            return;
        }

        let self = this
        self.toggleLoading()
        let validateUnique = true
        let nodesList = self.state.nodes
        nodesList.map((datum) => {
            if (datum.Name === name) {
                validateUnique = false
            }
        })
        if ((!name) || (!validateUnique)) {
            if (!name) {
                self.setState({ visible: true, errMsg: "Name field is mandatory" });
            }
            if (!validateUnique) {
                self.setState({ visibleUnique: true, errMsg: "Node already exists, please enter unique name" });
            }

            return;
        }
        if (!this.state.selectedRoles.length) {
            this.setState({ visible: true, errMsg: "Role is mandatory" })
            return;
        }
        let roles = [];
        this.state.selectedRoles.map((data) => roles.push(data.Id));
        let params = {
            'Name': name,
            'Host': host,
            'Iso_Id': parseInt(self.state.selectedIsoId),
            'Site_Id': parseInt(self.state.selectedSiteId),
            'roles': roles,
            'Type_Id': parseInt(self.state.selectedTypeId),
            'SN': document.getElementById('nodeSerialNumber').value,
            'Kernel_Id': parseInt(self.state.selectedLinuxId),
        }
        this.props.addNode(ADD_NODE, params).then(function () {
            NotificationManager.success("Node added successfully", "Node")
            self.setState({ displayModel: false, visible: false, isSaveLoading: false })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayModel: false, visible: false, isSaveLoading: false })
            NotificationManager.error("Something went wrong", "Node")
        })
    }

    toggleAddNodeModal() {
        this.setState(
            {
                displayModel: !this.state.displayModel,
                selectedSiteId: null,
                selectedRoles: [],
                selectedTypeId: null,
                selectedLinuxId: null,
                selectedIsoId: null,
                visible: false,
                visibleUnique: false
            })
    }

    getFilteredData = (data) => {
        this.setState({
            nodes: data
        })
    }

    render() {

        if (this.state.redirect) {
            return <Redirect push to={{ pathname: '/pcc/node/config' }} />
        }
        return (
            <Container-fluid >
                <Row>
                    <Col sm="12">
                        <div className='marginLeft10 '>
                            <Media>
                                <Media left>
                                    <Button onClick={() => (this.onConfigureClick())} className="custBtn marginLeft13N" disabled={!(this.state.selectedRowIndex.length > 0)} outline color="secondary">Configure</Button>
                                    <Button className="custBtn" outline color="secondary" onClick={() => (this.toggleAddNodeModal())}>New</Button>
                                    {this.showDeleteButton()}
                                </Media>
                                <Media body >
                                </Media>
                                <Media right>
                                    <SearchComponent data={this.state.constNodes} getFilteredData={this.getFilteredData} />
                                </Media>
                            </Media>
                            <Row className="tableTitle">Node Config Summary</Row>
                            <SummaryDataTable heading={this.state.nodeHead} data={this.state.nodes} checkBoxClick={this.checkBoxClick} selectEntireRow={true} selectedRowIndexes={this.state.selectedRowIndex} />
                        </div>

                    </Col>
                </Row>
                {this.addNodeModal()}
            </Container-fluid>
        );
    }
}


function mapStateToProps(state) {
    return {
        nodes: state.nodeReducer.getIn(['nodes']),
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
        fetchNodes: (url) => dispatch(fetchNodes(url)),
        addNode: (url, params) => dispatch(addNode(url, params)),
        deleteNodes: (url, params) => dispatch(deleteNodes(url, params)),
        setSelectedNodeIds: (nodes) => dispatch(setSelectedNodeIds(nodes))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeSummary);
