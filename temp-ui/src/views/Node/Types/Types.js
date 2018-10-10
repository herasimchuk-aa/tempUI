import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { typeHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import I from 'immutable'
import { FETCH_ALL_SYSTEM_TYPES, ADD_SYSTEM_TYPE, UPDATE_SYSTEM_TYPE, DELETE_SYSTEM_TYPES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux'
import { fetchTypes, addTypes, updateType, deleteType, setTypeHeadings } from '../../../actions/systemTypeAction';

class Types extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
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
            data: props.data ? props.data.toJS() : [],
            typeHead: props.typeHeadings ? props.typeHeadings.toJS() : typeHead
        }
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

    addTypeModal() {
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
        let typePromise = self.props.addTypes(ADD_SYSTEM_TYPE, params)
        typePromise.then(function (value) {
            NotificationManager.success("Type added successfully", "Type") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Type") // "error!"
        })
        self.setState({ displayModel: false, visible: false })

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

        this.props.deleteType(DELETE_SYSTEM_TYPES, deleteIds).then(function (data) {
            if (data.Failure && data.Failure.length) {
                let nameArr = getNameById(data.Failure, self.state.data)
                let str = ""
                if (nameArr.length === 1) {
                    str += nameArr[0] + " is in use."
                } else {
                    nameArr.map(function (name) {
                        str += name + ","
                    })
                    str += " are in use."
                }
                NotificationManager.error(str)
            } else {
                NotificationManager.success("System Type deleted successfully", "System Type") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "System Type") // "error!"
        })
        this.setState({ showDelete: false, selectedRowIndexes: [] });
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

    editTypeModal() {
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

        let typePromise = self.props.updateType(UPDATE_SYSTEM_TYPE, params)

        typePromise.then(function (value) {
            NotificationManager.success("Type updated successfully", "System Type") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "System Type") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }

    setTypeHeadings = (headings) => {
        this.props.setTypeHeadings(I.fromJS(headings))
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
                <SummaryDataTable key={this.counter++} heading={this.state.typeHead} data={this.state.data} checkBoxClick={this.checkBoxClick}
                    constHeading={typeHead} setHeadings={this.setTypeHeadings}
                    selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.addTypeModal()}
                {this.editTypeModal()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.systemTypeReducer.getIn(['types']),
        typeHeadings: state.systemTypeReducer.getIn(['typeHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTypes: (url) => dispatch(fetchTypes(url)),
        addTypes: (url, params) => dispatch(addTypes(url, params)),
        updateType: (url, params) => dispatch(updateType(url, params)),
        deleteType: (url, params) => dispatch(deleteType(url, params)),
        setTypeHeadings: (params) => dispatch(setTypeHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Types);