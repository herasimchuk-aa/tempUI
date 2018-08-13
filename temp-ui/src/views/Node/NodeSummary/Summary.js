import React, { Component } from 'react';
import { Col, Row, Input, Card, CardHeader, CardBody, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Media } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import { Redirect } from 'react-router-dom'
import { Button } from 'reactstrap';
import SummaryDataTable from './SummaryDataTable';
import DropDown from '../../../components/dropdown/DropDown';
import { nodeHead } from '../../../consts';
import '../../views.css';
import { NotificationManager } from 'react-notifications';
import SearchComponent from '../../../components/SearchComponent/SearchComponent';
import MultiselectDropDown from '../../../components/MultiselectDropdown/MultiselectDropDown';
import { trimString, converter } from '../../../components/Utility/Utility';
// import { CSVLink } from 'react-csv';

class NodeSummary extends React.Component {
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
            selectedType: '',
            selectedLinux: '',
            selectedIso: '',
            selectedSite: '',
            selectedRoles: []
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.updateNodeSummary, this);
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveRoleData, this);
        ServerAPI.DefaultServer().fetchAllIso(this.retrieveIsoData, this);
        ServerAPI.DefaultServer().fetchAllKernels(this.retrieveKernelsData, this);
        ServerAPI.DefaultServer().fetchAllSystemTypes(this.retrieveTypesData, this);
        ServerAPI.DefaultServer().fetchAllSite(this.retrieveSiteData, this);
    }

    updateNodeSummary = (instance, nodes) => {
        instance.setState({
            nodes: nodes,
            constNodes: Object.assign([], nodes)
        });
    }

    retrieveData(instance, data) {
        if (data === undefined) {
            NotificationManager.error('No Nodes present', 'Node');
        }
        else {
            instance.setState({ nodes: data, selectedRowIndex: [] });
        }
    }


    retrieveRoleData(instance, data) {
        if (!data) {
            NotificationManager.error('No Roles present', 'Role');
        }
        else {
            if (Object.keys(data).length) {
                instance.setState({ roleData: data });
            }
        }
    }

    retrieveIsoData(instance, data) {
        if (!data) {
            NotificationManager.error('No Base Linux ISOs present', 'Base Linux ISO');
        }
        else {
            if (Object.keys(data).length) {
                instance.setState({ isoData: data });
            }
        }
    }

    retrieveSiteData(instance, data) {
        if (!data) {
            NotificationManager.error('No sites present', 'Site');
        }
        else {
            if (Object.keys(data).length) {
                instance.setState({ siteData: data });
            }
        }
    }

    retrieveKernelsData(instance, data) {
        if (!data) {
            NotificationManager.error('No Kernels present', 'Kernel');
        }
        else {
            if (Object.keys(data).length) {
                instance.setState({ kernelData: data });
            }
        }
    }

    retrieveTypesData(instance, data) {
        if (!data) {
            NotificationManager.error('No System Types present', 'System Tpye');
        }
        else {
            if (Object.keys(data).length) {
                instance.setState({ typedata: data });
            }
        }
    }

    getSelectedData = (data, identity) => {
        if (identity == 'Type') {
            this.setState({ selectedType: data })
        }
        if (identity == 'Linux') {
            this.setState({ selectedLinux: data })
        }
        if (identity == 'ISO') {
            this.setState({ selectedIso: data })
        }
        if (identity == 'Site') {
            this.setState({ selectedSite: data })
        }
    }

    getRoles() {
        let rolesHtml = [];
        this.state.roleData.map((item) => (rolesHtml.push(<option>{item.label}</option>)));
        return rolesHtml;
    }

    getTypes() {
        let typesHtml = [];
        this.state.typedata.map((item) => (typesHtml.push(<option>{item.label}</option>)));
        return typesHtml;
    }

    getKernel() {
        let kernelHtml = [];
        this.state.kernelData.map((item) => (kernelHtml.push(<option>{item.label}</option>)));
        return kernelHtml;
    }

    getIso() {
        let isoHtml = [];
        this.state.isoData.map((item) => (isoHtml.push(<option>{item.label}</option>)));
        return isoHtml;
    }

    getSite() {
        let siteHtml = [];
        this.state.siteData.map((item) => (siteHtml.push(<option>{item.label}</option>)));
        return siteHtml;
    }


    checkBoxClick = (rowIndex, singleRowClick) => {
        if (singleRowClick) {
            let { nodes } = this.state
            let selectedRows = [nodes[rowIndex]]
            selectedRows[0].roles = converter(nodes[rowIndex].roles);
            this.setState({
                selectedRows, redirect: true
            })
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
        let selectedRows = []
        if (selectedRowIndex.length) {
            selectedRowIndex.map(function (rowIndex) {
                selectedRows.push(nodes[rowIndex])
            })
            this.setState({
                selectedRows, redirect: true
            })
        }
    }

    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteNode())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteNode() {
        for (let i = 0; i < this.state.selectedRowIndex.length; i++) {
            ServerAPI.DefaultServer().deleteNode(this.callbackDelete, this, this.state.nodes[this.state.selectedRowIndex[i]].name);
        }
        this.setState({ showDelete: !this.state.showDelete });
    }

    callbackDelete = (instance) => {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.retrieveData, this);
    }

    renderFilterComponent = () => {
        let filters = []
        let filterOptions = [
            {
                'id': 'status',
                'displayName': 'Status',
                'options': [
                    {
                        'id': 'active',
                        'displayName': 'Active',
                    },
                    {
                        'id': 'unprovisioned',
                        'displayName': 'Unprovisioned',
                    }
                ]
            }, {
                'id': 'role',
                'displayName': 'Role',
                'options': [
                    {
                        'id': 'Leaf',
                        'displayName': 'Leaf',
                    },
                    {
                        'id': 'Spine',
                        'displayName': 'Spine',
                    },
                    {
                        'id': 'K8Worker',
                        'displayName': 'K8Worker',
                    },
                    {
                        'id': 'etcD',
                        'displayName': 'etcD',
                    },
                    {
                        'id': 'Cache',
                        'displayName': 'Cache',
                    }
                ]
            },
            {
                'id': 'type',
                'displayName': 'Type',
                'options': [
                    {
                        'id': 'PS-3001',
                        'displayName': 'PS-3001',
                    },
                    {
                        'id': 'SuperMicro-x',
                        'displayName': 'SuperMicro-x',
                    }
                ]
            },
            {
                'id': 'site',
                'displayName': 'Site',
                'options': [
                    {
                        'id': 'SJC0',
                        'displayName': 'SJC0',
                    }
                ]
            }
        ]

        filterOptions.map(function (filterOption) {
            let options = filterOption.options
            if (!options || !options.length)
                return null
            filters.push(<div>
                <div className="head-name">{filterOption.displayName}</div>
                <select multiple className="form-control">{options.map(function (option) {
                    return <option value={option.id}>{option.displayName}</option>
                })}</select>
            </div>)
        })

        return (
            <Card className="borRad">
                <CardHeader>Filter</CardHeader>
                <CardBody>
                    {filters}
                    <div style={{ paddingTop: '10px' }}>
                        <Button className="custBtn" outline color="secondary">Apply</Button>
                        <Button className="custBtn" outline color="secondary">Reset</Button>
                    </div>
                </CardBody>
            </Card>
        )
    }

    handleChanges = (selectedOption) => {
        this.setState({ selectedRoles: selectedOption });
    }

    onDismiss() {
        this.setState({ visible: false, visibleUnique: false });
    }

    renderUpgradeModelDialog() {

        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.click()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.click()}>Add Node</ModalHeader>
                    <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >
                        {this.state.errMsg}
                    </Alert>
                    <Alert color="danger" isOpen={this.state.visibleUnique} toggle={() => this.onDismiss()} >
                        {this.state.errMsg}
                    </Alert>
                    <ModalBody>
                        <Row>
                            <Col sm="6" className="marTop10">Name

                                <Input id='nodeName' autoFocus className="marTop10" />

                            </Col>
                            <Col sm="6" className="marTop10">Site
                                <DropDown options={this.state.siteData} getSelectedData={this.getSelectedData} identity={"Site"} default={this.state.selectedSite} />
                            </Col>
                            {/* <Input id='site' className="marTop10" /> */}
                        </Row>
                        <Row>
                            <Col sm="6" className="marTop10">Roles
                                <MultiselectDropDown value={this.state.selectedRoles} getSelectedData={this.handleChanges} options={this.state.roleData} /></Col>
                            <Col sm="6" className="marTop10">
                                Serial Number <Input id='nodeSerialNumber' className="marTop10" />
                                <br />Type
                                <DropDown options={this.state.typedata} getSelectedData={this.getSelectedData} identity={"Type"} default={this.state.selectedType} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="6" className="marTop10">Linux Kernel
                                <DropDown options={this.state.kernelData} getSelectedData={this.getSelectedData} identity={"Linux"} default={this.state.selectedLinux} />
                            </Col>
                            <Col sm="6" className="marTop10">Base Linux ISO
                                <DropDown options={this.state.isoData} getSelectedData={this.getSelectedData} identity={"ISO"} default={this.state.selectedIso} />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" className="custBtn" onClick={() => (this.addNode())}>Add</Button>{'  '}
                        <Button outline color="primary" className="custBtn" onClick={() => (this.click())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    addNode() {

        let nodeName = document.getElementById('nodeName').value

        let name = trimString(nodeName)
        let data = this.state.nodes
        let validateUnique = true
        data.map((datum) => {
            if (datum.name == name) {
                validateUnique = false
            }
        })
        if ((!name) || (!validateUnique)) {
            if (!name) {
                this.setState({ visible: true, errMsg: "Name field is mandatory" });
            }
            if (!validateUnique) {
                this.setState({ visibleUnique: true, errMsg: "Name field is already exist, please enter unique name" });
            }

            return;
        }
        if (!this.state.selectedRoles.length) {
            this.setState({ visible: true, errMsg: "Role is mandatory" })
            return;
        }
        let roles = [];
        this.state.selectedRoles.map((data) => roles.push(data.value));
        let a = {
            'Name': name,
            'site': this.state.selectedSite,
            'roles': roles,
            'type': this.state.selectedType,
            'serialNumber': document.getElementById('nodeSerialNumber').value,
            'kernel': this.state.selectedLinux,
            'linuxISO': this.state.selectedIso
        }
        ServerAPI.DefaultServer().addNode(this.callback, this, a);

    }


    /* getSelectRoleValues(select) {
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
    } */

    callback(instance, data) {
        let a = instance.state.nodes
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel, errMsg: '' })
        NotificationManager.success('Added Successfully', 'Node');
    }

    click() {
        this.setState({ displayModel: !this.state.displayModel, selectedSite: null, selectedRoles: [], selectedType: null, selectedLinux: null, selectedIso: null, visible: false, visibleUnique: false })
    }

    getFilteredData = (data) => {
        this.setState({
            nodes: data
        })
    }

    downloadCSV() {
        if (!this.state.nodes || !this.state.nodes.length) {
            return;
        }
        let csvData = [];
        this.state.nodes.map((item) => {
            console.log(item);
            csvData.push({
                'Name': item.name,
                'Site': item.site,
                'Status': item.status,
                'Roles': item.roles,
                'Type': item.nodeType,
                'Serial Number': item.serialNumber,
                'Linux Kernel': item.kernel,
                'Base Linux ISO': item.linuxISO,
                'Interface': item.allInterfaces.map((intItem) => {
                    csvData.push({
                        'Interface Name': intItem.port,
                        'IP': intItem.IPAddress,
                        'Management Interface': intItem.isMngmntIntf
                    })
                }),
                // 'Interface Name': item.allInterfaces.map((intItem) => { csvData.push(intItem.port) }),
                // 'IP Address': item.allInterfaces.map((intItem) => { csvData.push(intItem.IPAddress) }),
                // 'Management Interface': item.allInterfaces.map((intItem) => { csvData.push(intItem.isMngmntIntf) }),

            })

        })


        return <CSVLink data={csvData} className="btn btn-primary">Download CSV</CSVLink>
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={{ pathname: '/pcc/node/config', state: this.state.selectedRows }} />
        }
        return (
            <Container-fluid >
                <Row>
                    <Col sm="12">
                        <div className='marginLeft10 '>
                            <Media>
                                <Media left>
                                    <Button onClick={() => (this.onConfigureClick())} className="custBtn marginLeft13N" disabled={!(this.state.selectedRowIndex.length > 0)} outline color="secondary">Configure</Button>
                                    <Button className="custBtn" outline color="secondary" onClick={() => (this.click())}>New</Button>
                                    {this.showDeleteButton()}
                                </Media>
                                <Media body >
                                </Media>
                                <Media right>
                                    <SearchComponent data={this.state.constNodes} getFilteredData={this.getFilteredData} />
                                    {/* {this.downloadCSV()} */}
                                </Media>
                            </Media>
                            <Row className="tableTitle">Node Config Summary</Row>
                            <SummaryDataTable heading={this.state.nodeHead} data={this.state.nodes} checkBoxClick={this.checkBoxClick} selectEntireRow={true} selectedRowIndexes={this.state.selectedRowIndex} />
                        </div>

                    </Col>
                    <Col sm="3">

                        {/* {this.renderFilterComponent()} */}
                    </Col>
                </Row>
                {this.renderUpgradeModelDialog()}
            </Container-fluid>
        );
    }
}
export default NodeSummary;