import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { lldpHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi'
import { FETCH_ALL_LLDP, ADD_LLDP, UPDATE_LLDP, DELETE_LLDP } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';

class LLDP extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            lldpHead: lldpHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.retrieveLLDPData()
    }

    retrieveLLDPData() {
        let self = this
        getRequest(FETCH_ALL_LLDP).then(function (json) {
            self.setState({ data: json.Data, selectedRowIndexes: [] })
        })
    }

    drawHeader() {
        return (<Row className="headerRow">
            <Col sm="1" className="head-name">  </Col>
            <Col sm="4" className="head-name">Name</Col>
            <Col sm="4" className="head-name">Description</Col>
            {/* <Col sm="4" className="head-name">Applicable Type</Col> */}
        </Row>)
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


    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteLLDP())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteLLDP() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        postRequest(DELETE_LLDP, deleteIds).then(function (data) {
            let failedLLDP = []
            failedLLDP = getNameById(data.Data.Failure, self.state.data);
            failedLLDP.map((item) => {
                NotificationManager.error(item + ' is in use', "LLDP")
            })
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.retrieveLLDPData();
        })
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add LLDP</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='lldpName' /><br />
                        Location <Input className="marTop10" id='lldpLoc' /><br />
                        Description <Input className="marTop10" id='lldpDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addLLDP())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addLLDP() {
        let self = this;
        let lldp = document.getElementById('lldpName').value
        let validlldp = trimString(lldp)
        if (!validlldp) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validlldp,
            'Location': document.getElementById('lldpLoc').value,
            'Description': document.getElementById('lldpDesc').value
        }
        postRequest(ADD_LLDP, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "LLDP")
                self.setState({ displayModel: false, visible: false })

            }
        })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one LLDP to edit")
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
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit LLDP</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='lldpNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='lldpLocEdit' defaultValue={edittedData.Location} /><br />
                        Description <Input className="marTop10" id='lldpDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editLldp())}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editLldp = () => {
        let self = this
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        let params = {
            'Id': edittedData.Id,
            'Location': document.getElementById('lldpLocEdit').value ? document.getElementById('lldpLocEdit').value : "-",
            'Description': document.getElementById('lldpDescEdit').value ? document.getElementById('lldpDescEdit').value : "-"
        }
        putRequest(UPDATE_LLDP, params).then(function (data) {
            console.log(data.Data)
            if (data.StatusCode == 200) {
                let existingData = self.state.data;
                existingData[self.state.selectedRowIndexes[0]] = data.Data
                self.setState({ data: existingData, displayEditModel: false, selectedRowIndexes: [] })
            }
            else {
                NotificationManager.error("Something went wrong", "LLDP")
                self.setState({ displayEditModel: false, selectedRowIndexes: [] })

            }
        })
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">LLDP</div>
                </Media>    
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media> 
            </Media>
            <div style={{height:'200px',overflowY:'scroll', overflowX:'hidden'}}>
            <SummaryDataTable key={this.counter++} heading={this.state.lldpHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
            </div>
            {this.renderUpgradeModelDialog()}
            {this.renderEditModelDialog()}
        </div>
        );
    }



}

export default LLDP;