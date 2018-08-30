import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { typeHead } from '../../../consts';
import { trimString } from '../../../components/Utility/Utility';
import { getRequest, postRequest } from '../../../apis/RestApi';
import { FETCH_ALL_SYSTEM_TYPES, ADD_SYSTEM_TYPE, DELETE_SYSTEM_TYPES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';

class Types extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            typeHead: typeHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            visible: false,
            errorMsg: ''
        }
    }

    componentDidMount() {
        this.retrieveTypeData()
    }

    retrieveTypeData() {
        let self = this
        getRequest(FETCH_ALL_SYSTEM_TYPES).then(function (json) {
            self.setState({ data: json.Data, selectedRowIndexes: [] })
        })
    }

    checkBoxClick = (rowIndex) => {
        let { selectedRowIndexes } = this.state
        let arrayIndex = selectedRowIndexes.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndexes.splice(arrayIndex, 1)
        } else {
            selectedRowIndexes.push(rowIndex)
        }
        if (this.state.selectedRowIndexes.length > 0) {
            this.setState({ showDelete: true });
        }
        else {
            this.setState({ showDelete: false });
        }
    }

    onDismiss() {
        this.setState({ visible: false })
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.click()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.click()}>Add System Type</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()}>{this.state.errorMsg}</Alert>
                        <Row>
                            <Col>Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='typeName' required={true} /><br />
                                Vendor <Input className="marTop10" id='typeVendor' /><br />
                                Rack Unit <Input className="marTop10" id='typeRackUnit' /><br />
                                AirFlow <Input className="marTop10" id='typeAirFlow' /><br /></Col><Col>
                                Front Panel Interface<font color="red"><sup>*</sup></font> <Input className="marTop10" type="number" min={1} max={128} id='noFPI' /><br />
                                Speed Front Panel Interface <Input className="marTop10" id='SpeedFPI' /><br />
                                Management Interfaces<font color="red"><sup>*</sup></font> <Input className="marTop10" type="number" min={0} id='noMI' /><br />
                                Speed/Type <Input className="marTop10" id='speedType' /><br /></Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addType())}>Add</Button>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.click())}>Cancel</Button>


                    </ModalFooter>
                </Modal>
            );
        }
    }

    click() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addType() {
        let self = this
        let typename = document.getElementById('typeName').value
        let validtypename = trimString(typename)
        let params = {
            'Name': validtypename,
            'Vendor': document.getElementById('typeVendor').value,
            'RackUnit': document.getElementById('typeRackUnit').value,
            'Airflow': document.getElementById('typeAirFlow').value,
            'FrontPanelInterfaces': parseInt(document.getElementById('noFPI').value),
            'SpeedFrontPanelInterfaces': document.getElementById('SpeedFPI').value,
            'ManagementInterfaces': parseInt(document.getElementById('noMI').value),
            'SpeedType': document.getElementById('speedType').value
        }
        if (!params.Name) {
            this.setState({ visible: true, errorMsg: 'Please enter the System Name' });
            return;
        }

        if (params.FrontPanelInterfaces > 128 || params.FrontPanelInterfaces < 1 || isNaN(params.FrontPanelInterfaces)) {
            this.setState({ visible: true, errorMsg: 'Please enter a valid Front Panel Interface (between 1 and 128)' });
            return;
        }
        if (params.ManagementInterfaces < 0 || isNaN(params.ManagementInterfaces)) {
            this.setState({ visible: true, errorMsg: 'Please enter a valid Management Interface' });
            return;
        }
        postRequest(ADD_SYSTEM_TYPE, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "System Type")
                self.setState({ displayModel: false, visible: false })

            }
        })

    }
    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteTypes())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteTypes() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        postRequest(DELETE_SYSTEM_TYPES, deleteIds).then(function (data) {
            console.log(data)
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.retrieveTypeData();
        })
    }



    render() {

        return (
            <div>
                <div className='marginLeft10'>
                    <Button onClick={() => (this.click())} className="custBtn marginLeft13N" outline color="secondary">New</Button>
                    {this.showDeleteButton()}
                </div>
                <Row className="tableTitle">System Types</Row>
                <SummaryDataTable heading={this.state.typeHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.renderUpgradeModelDialog()}
            </div>
        );
    }



}

export default Types;