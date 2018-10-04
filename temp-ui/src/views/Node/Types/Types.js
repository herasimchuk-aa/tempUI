import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { typeHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi';
import { FETCH_ALL_SYSTEM_TYPES, ADD_SYSTEM_TYPE, UPDATE_SYSTEM_TYPE, DELETE_SYSTEM_TYPES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux'
import { fetchTypes } from '../../../actions/systemTypeAction';

class Types extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            typeHead: typeHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false,
            errorMsg: ''
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.fetchTypes(FETCH_ALL_SYSTEM_TYPES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : []
        }
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
            let failedTypes = []
            failedTypes = getNameById(data.Data.Failure, self.state.data);
            failedTypes.map((item) => {
                NotificationManager.error(item + ' is in use', "Type")
            })
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.retrieveTypeData();
        })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one System Type to edit")
            return
        }
        this.setState({ displayEditModel: true })
        console.log(this.state.data[this.state.selectedRowIndexes[0]])

    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    renderEditModelDialog() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit System Type</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()}>{this.state.errorMsg}</Alert>
                        <Row>
                            <Col>Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='typeNameEdit' disabled defaultValue={edittedData.Name} required={true} /><br />
                                Vendor <Input className="marTop10" id='typeVendorEdit' disabled defaultValue={edittedData.Vendor} /><br />
                                Rack Unit <Input className="marTop10" id='typeRackUnitEdit' defaultValue={edittedData.RackUnit} /><br />
                                AirFlow <Input className="marTop10" id='typeAirFlowEdit' defaultValue={edittedData.Airflow} /><br /></Col><Col>
                                Front Panel Interface<font color="red"><sup>*</sup></font> <Input className="marTop10" type="number" min={1} max={128} id='noFPIEdit' defaultValue={edittedData.FrontPanelInterfaces} /><br />
                                Speed Front Panel Interface <Input className="marTop10" id='SpeedFPIEdit' defaultValue={edittedData.SpeedFrontPanelInterfaces} /><br />
                                Management Interfaces<font color="red"><sup>*</sup></font> <Input className="marTop10" type="number" min={0} id='noMIEdit' defaultValue={edittedData.ManagementInterfaces} /><br />
                                Speed/Type <Input className="marTop10" id='speedTypeEdit' defaultValue={edittedData.SpeedType} /><br /></Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editType())}>Save</Button>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>


                    </ModalFooter>
                </Modal>
            );
        }
    }

    editType = () => {
        let self = this
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        let params = {
            'Id': edittedData.Id,
            'RackUnit': document.getElementById('typeRackUnitEdit').value ? document.getElementById('typeRackUnitEdit').value : "-",
            'Airflow': document.getElementById('typeAirFlowEdit').value ? document.getElementById('typeAirFlowEdit').value : "-",
            'FrontPanelInterfaces': parseInt(document.getElementById('noFPIEdit').value),
            'SpeedFrontPanelInterfaces': document.getElementById('SpeedFPIEdit').value ? document.getElementById('SpeedFPIEdit').value : "-",
            'ManagementInterfaces': parseInt(document.getElementById('noMIEdit').value),
            'SpeedType': document.getElementById('speedTypeEdit').value ? document.getElementById('speedTypeEdit').value : "-"
        }

        if (params.FrontPanelInterfaces > 128 || params.FrontPanelInterfaces < 1 || isNaN(params.FrontPanelInterfaces)) {
            this.setState({ visible: true, errorMsg: 'Please enter a valid Front Panel Interface (between 1 and 128)' });
            return;
        }
        if (params.ManagementInterfaces < 0 || isNaN(params.ManagementInterfaces)) {
            this.setState({ visible: true, errorMsg: 'Please enter a valid Management Interface' });
            return;
        }
        putRequest(UPDATE_SYSTEM_TYPE, params).then(function (data) {
            console.log(data.Data)
            if (data.StatusCode == 200) {
                let existingData = self.state.data;
                existingData[self.state.selectedRowIndexes[0]] = data.Data
                self.setState({ data: existingData, displayEditModel: false, selectedRowIndexes: [], visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "System Type")
                self.setState({ displayEditModel: false, selectedRowIndexes: [], visible: false })

            }
        })
    }



    render() {

        return (
            <div>
                <div className='marginLeft10'>
                    <Button onClick={() => (this.click())} className="custBtn marginLeft13N" outline color="secondary">New</Button>
                    <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                    {this.showDeleteButton()}
                </div>
                <Row className="tableTitle">System Types</Row>
                <SummaryDataTable key={this.counter++} heading={this.state.typeHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.renderUpgradeModelDialog()}
                {this.renderEditModelDialog()}
            </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.systemTypeReducer.getIn(['typeData'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTypes: (url) => dispatch(fetchTypes(url))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Types);