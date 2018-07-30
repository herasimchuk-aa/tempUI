import React, { Component } from 'react';
import { Col, Row, Input, Card, CardHeader, CardBody, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
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

class NodeSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            constNodes: [],
            roleData: [],
            isoData: [],
            kernelData: [],
            typedata: [],
            nodeHead: nodeHead,
            selectedRowIndex: [],
            selectedRows: [],
            displayModel: false,
            visible: false,
            showDelete: false,
            redirect: false,
            selectedType: '',
            selectedLinux: '',
            selectedIso: '',
            selectedRoles: []
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.updateNodeSummary, this);
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveRoleData, this);
        ServerAPI.DefaultServer().fetchAllIso(this.retrieveIsoData, this);
        ServerAPI.DefaultServer().fetchAllKernels(this.retrieveKernelsData, this);
        ServerAPI.DefaultServer().fetchAllSystemTypes(this.retrieveTypesData, this);
    }

    updateNodeSummary = (instance, nodes) => {
        instance.setState({
            nodes: nodes,
            constNodes: Object.assign([], nodes)
        });
    }

    retrieveData(instance, data) {
        if (data === undefined) {
            alert("No data received");
        }
        else {
            instance.setState({ nodes: data, selectedRowIndex: [] });
        }
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

    checkBoxClick = (rowIndex, singleRowClick) => {
        if (singleRowClick) {
            let { nodes } = this.state
            let selectedRows = [nodes[rowIndex]]
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
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.click()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.click()}>Add Node</ModalHeader>
                    <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >
                        Name field is mandatory
                    </Alert>
                    <ModalBody>
                        <Row>
                            <Col sm="6" className="marTop10">Name <Input id='name' autoFocus className="marTop10" /></Col>
                            <Col sm="6" className="marTop10">Site <Input id='site' className="marTop10" /></Col>
                        </Row>
                        <Row>
                            <Col sm="6" className="marTop10">Roles {/* <select multiple className="form-control marTop10" id="roles">{this.getRoles()}</select> */}
                                <MultiselectDropDown value={this.state.selectedRoles} getSelectedData={this.handleChanges} options={this.state.roleData} /></Col>
                            <Col sm="6" className="marTop10">
                                Serial Number <Input id='serialNumber' className="marTop10" />
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
        if (!document.getElementById('name').value) {
            this.setState({ visible: true });
            return;
        }
        let roles = [];
        this.state.selectedRoles.map((data) => roles.push(data.value));
        let a = {
            'Name': document.getElementById('name').value,
            'site': document.getElementById('site').value,
            'roles': roles,
            'type': this.state.selectedType,
            'serialNumber': document.getElementById('serialNumber').value,
            'kernel': this.state.selectedLinux,
            'linuxISO': this.state.selectedIso
        }
        ServerAPI.DefaultServer().addNode(this.callback, this, a);

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

    callback(instance, data) {
        let a = instance.state.nodes
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel })
        NotificationManager.success('Added Successfully', 'Node');
    }

    click() {
        this.setState({ displayModel: !this.state.displayModel })
    }

    getFilteredData = (data) => {
        this.setState({
            nodes: data
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={{ pathname: '/node/config', state: this.state.selectedRows }} />
        }
        return (
            <Container-fluid >
                <Row>

                    <Col sm="9">
                        <div className='marginLeft10 '>
                            <Button onClick={() => (this.onConfigureClick())} className="custBtn marginLeft13N" outline color="secondary">Configure</Button>

                            <Button className="custBtn" outline color="secondary" onClick={() => (this.click())}>New</Button>
                            {this.showDeleteButton()}
                            <Row className="tableTitle">Node Config Summary</Row>
                            <SummaryDataTable heading={this.state.nodeHead} data={this.state.nodes} checkBoxClick={this.checkBoxClick} selectEntireRow={true} selectedRowIndexes={this.state.selectedRowIndex} />
                        </div>

                    </Col>
                    <Col sm="3">
                        <SearchComponent data={this.state.constNodes} getFilteredData={this.getFilteredData} />
                        {this.renderFilterComponent()}
                    </Col>
                </Row>
                {this.renderUpgradeModelDialog()}
            </Container-fluid>
        );
    }
}
export default NodeSummary;