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
import { FETCH_ALL_SITES, FETCH_ALL_ROLES, FETCH_ALL_ISOS, FETCH_ALL_KERNELS, FETCH_ALL_SYSTEM_TYPES, FETCH_ALL_NODES, ADD_NODE } from '../../../apis/RestConfig';
import { getRequest, postRequest } from '../../../apis/RestApi';

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
            selectedTypeId: '',
            selectedLinuxId: '',
            selectedIsoId: '',
            selectedSiteId: '',
            selectedRoles: []
        }
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

        let nodes = []
        Promise.all([typePromise, rolePromise, kernelPromise, isoPromise, sitePromise]).then(function () {
            getRequest(FETCH_ALL_NODES).then(function (json) {
                nodes = self.convertData(json.Data, typeData, kernelData, isoData, siteData, roleData)
                self.setState({ nodes: nodes, constNodes: Object.assign([], nodes) })
            })
        }).then(function () {
            self.setState({ typedata: typeData, roleData: roleData, kernelData: kernelData, isoData: isoData, siteData: siteData })
        })
    }

    convertData(nodes, types, kernels, isos, sites, roles) {
        nodes.map((node) => {
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

        })
        return nodes
    }


    getSelectedData = (data, identity) => {
        if (identity == 'Type') {
            this.setState({ selectedTypeId: data })
        }
        if (identity == 'Linux') {
            this.setState({ selectedLinuxId: data })
        }
        if (identity == 'ISO') {
            this.setState({ selectedIsoId: data })
        }
        if (identity == 'Site') {
            this.setState({ selectedSiteId: data })
        }
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
                selectedRows[0].roles = converter(nodes[rowIndex].roles);
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

    // renderFilterComponent = () => {
    //     let filters = []
    //     let filterOptions = [
    //         {
    //             'id': 'status',
    //             'displayName': 'Status',
    //             'options': [
    //                 {
    //                     'id': 'active',
    //                     'displayName': 'Active',
    //                 },
    //                 {
    //                     'id': 'unprovisioned',
    //                     'displayName': 'Unprovisioned',
    //                 }
    //             ]
    //         }, {
    //             'id': 'role',
    //             'displayName': 'Role',
    //             'options': [
    //                 {
    //                     'id': 'Leaf',
    //                     'displayName': 'Leaf',
    //                 },
    //                 {
    //                     'id': 'Spine',
    //                     'displayName': 'Spine',
    //                 },
    //                 {
    //                     'id': 'K8Worker',
    //                     'displayName': 'K8Worker',
    //                 },
    //                 {
    //                     'id': 'etcD',
    //                     'displayName': 'etcD',
    //                 },
    //                 {
    //                     'id': 'Cache',
    //                     'displayName': 'Cache',
    //                 }
    //             ]
    //         },
    //         {
    //             'id': 'type',
    //             'displayName': 'Type',
    //             'options': [
    //                 {
    //                     'id': 'PS-3001',
    //                     'displayName': 'PS-3001',
    //                 },
    //                 {
    //                     'id': 'SuperMicro-x',
    //                     'displayName': 'SuperMicro-x',
    //                 }
    //             ]
    //         },
    //         {
    //             'id': 'site',
    //             'displayName': 'Site',
    //             'options': [
    //                 {
    //                     'id': 'SJC0',
    //                     'displayName': 'SJC0',
    //                 }
    //             ]
    //         }
    //     ]

    //     filterOptions.map(function (filterOption) {
    //         let options = filterOption.options
    //         if (!options || !options.length)
    //             return null
    //         filters.push(<div>
    //             <div className="head-name">{filterOption.displayName}</div>
    //             <select multiple className="form-control">{options.map(function (option) {
    //                 return <option value={option.id}>{option.displayName}</option>
    //             })}</select>
    //         </div>)
    //     })

    //     return (
    //         <Card className="borRad">
    //             <CardHeader>Filter</CardHeader>
    //             <CardBody>
    //                 {filters}
    //                 <div style={{ paddingTop: '10px' }}>
    //                     <Button className="custBtn" outline color="secondary">Apply</Button>
    //                     <Button className="custBtn" outline color="secondary">Reset</Button>
    //                 </div>
    //             </CardBody>
    //         </Card>
    //     )
    // }

    handleChanges = (selectedOption) => {
        console.log(selectedOption)
        this.setState({ selectedRoles: selectedOption });
    }

    onDismiss() {
        this.setState({ visible: false, visibleUnique: false });
    }

    addNodeModal() {
        console.log(this.state.roleData)
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
                                <Input id='nodeName' autoFocus className="marTop10" />
                            </Col>
                            <Col sm="6" className="marTop10">Site
                                <DropDown options={this.state.siteData} getSelectedData={this.getSelectedData} identity={"Site"} default={this.state.selectedSiteId} />
                            </Col>
                            {/* <Input id='site' className="marTop10" /> */}
                        </Row>
                        <Row>
                            <Col sm="6" className="marTop10">Roles<font color="red"><sup>*</sup></font>
                                <MultiselectDropDown value={this.state.selectedRoles} getSelectedData={this.handleChanges} options={this.state.roleData} /></Col>
                            <Col sm="6" className="marTop10">
                                Serial Number <Input id='nodeSerialNumber' className="marTop10" />
                                <br />Type
                                <DropDown options={this.state.typedata} getSelectedData={this.getSelectedData} identity={"Type"} default={this.state.selectedTypeId} />
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
                        <Button outline color="primary" className="custBtn" onClick={() => (this.addNode())}>Add</Button>{'  '}
                        <Button outline color="primary" className="custBtn" onClick={() => (this.toggleAddNodeModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    addNode() {
        let nodeName = document.getElementById('nodeName').value
        let name = trimString(nodeName)
        let self = this
        // let validateUnique = true
        // data.map((datum) => {
        //     if (datum.name == name) {
        //         validateUnique = false
        //     }
        // })
        // if ((!name) || (!validateUnique)) {
        //     if (!name) {
        //         self.setState({ visible: true, errMsg: "Name field is mandatory" });
        //     }
        //     if (!validateUnique) {
        //         self.setState({ visibleUnique: true, errMsg: "Name field is already exist, please enter unique name" });
        //     }

        //     return;
        // }
        // if (!this.state.selectedRoles.length) {
        //     this.setState({ visible: true, errMsg: "Role is mandatory" })
        //     return;
        // }
        let roles = [];
        this.state.selectedRoles.map((data) => roles.push(data.value));
        let params = {
            'Name': name,
            'Iso_Id': parseInt(self.state.selectedIsoId),
            'Site_Id': parseInt(self.state.selectedSiteId),
            'roles': roles,
            'Type_Id': parseInt(self.state.selectedTypeId),
            'SN': document.getElementById('nodeSerialNumber').value,
            'Kernel_Id': parseInt(self.state.selectedLinuxId),
        }
        postRequest(ADD_NODE, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.nodes;
                if (!renderedData) {
                    renderedData = []
                }
                if (data.Data.roles.length) {
                    data.Data.roles.map((role) => {
                        self.state.roleData.find(function (element, index) {
                            if (role == element.Id) {
                                role.Name = element.Name
                                return;
                            }
                        })
                    })
                }
                console.log(data.Data.roles)
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "node")
                self.setState({ displayModel: false, visible: false })

            }
        })
    }

    toggleAddNodeModal() {
        this.setState({ displayModel: !this.state.displayModel, selectedSiteId: null, selectedRoles: [], selectedTypeId: null, selectedLinuxId: null, selectedIsoId: null, visible: false, visibleUnique: false })
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
            csvData.push({
                'Name': item.Name,
                'Site_Id': item.Site_Id,
                'status': item.status,
                'roles': item.roles,
                'Type_Id': item.Type_Id,
                'SN': item.SN,
                'Kernel_Id': item.Kernel_Id,
                'Iso_Id': item.Iso_Id,
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
                                    <Button className="custBtn" outline color="secondary" onClick={() => (this.toggleAddNodeModal())}>New</Button>
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
                    {/* {this.renderFilterComponent()} */}
                </Row>
                {this.addNodeModal()}
            </Container-fluid>
        );
    }
}
export default NodeSummary;