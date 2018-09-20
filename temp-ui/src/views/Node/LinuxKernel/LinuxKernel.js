import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert,Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { kernelHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi'
import { FETCH_ALL_KERNELS, ADD_KERNEL, UPDATE_KERNEL, DELETE_KERNELS } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';

class LinuxKernel extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            kernelHead: kernelHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.retrieveKernelData()
    }

    retrieveKernelData() {
        let self = this
        getRequest(FETCH_ALL_KERNELS).then(function (json) {
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteKernel())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteKernel() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        postRequest(DELETE_KERNELS, deleteIds).then(function (data) {
            let failedKernels = []
            failedKernels = getNameById(data.Data.Failure, self.state.data);
            failedKernels.map((item) => {
                NotificationManager.error(item + ' is in use', "Kernel")
            })
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.retrieveKernelData();
        })
    }


    drawtable() {
        let { data } = this.state
        let rows = []
        let header = this.drawHeader()
        rows.push(header)
        if (data && data.length) {
            let kernel = data;
            kernel.map((linuxKernel, i) => {
                let row1 = 'headerRow2'

                if (i % 2 === 0) {
                    row1 = 'headerRow1'
                }
                if (i == kernel.length - 1) {
                    row1 = row1 + ' headerRow3 '
                }
                let row = (<Row className={row1}>
                    <Col sm="1" className="pad"><Input className="marLeft40" type="checkbox" onChange={() => (this.checkBoxClick(i))}></Input></Col>
                    <Col sm="4" className="pad">{linuxKernel.label}</Col>
                    <Col sm="4" className="pad">{linuxKernel.description}</Col>
                    {/* <Col sm="4" className="pad">{linuxKernel.value}</Col> */}
                </Row>)
                rows.push(row)
            })
        }
        return rows
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Linux Kernel</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='kernelName' /><br />
                        Location <Input className="marTop10" id='kernelLoc' /><br />
                        Description <Input className="marTop10" id='kernelDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addKernel())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addKernel() {
        let self = this;
        let kernel = document.getElementById('kernelName').value
        let validKernel = trimString(kernel)
        if (!validKernel) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validKernel,
            'Location': document.getElementById('kernelLoc').value,
            'Description': document.getElementById('kernelDesc').value
        }
        postRequest(ADD_KERNEL, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "Kernel")
                self.setState({ displayModel: false, visible: false })

            }
        })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Kernel to edit")
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
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Linux Kernel</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='kernelNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='kernelLocEdit' defaultValue={edittedData.Location} /><br />
                        Description <Input className="marTop10" id='kernelDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editKernel())}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editKernel = () => {
        let self = this
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        let params = {
            'Id': edittedData.Id,
            'Location': document.getElementById('kernelLocEdit').value ? document.getElementById('kernelLocEdit').value : "-",
            'Description': document.getElementById('kernelDescEdit').value ? document.getElementById('kernelDescEdit').value : "-"
        }
        putRequest(UPDATE_KERNEL, params).then(function (data) {
            console.log(data.Data)
            if (data.StatusCode == 200) {
                let existingData = self.state.data;
                existingData[self.state.selectedRowIndexes[0]] = data.Data
                self.setState({ data: existingData, displayEditModel: false, selectedRowIndexes: [] })
            }
            else {
                NotificationManager.error("Something went wrong", "Kernel")
                self.setState({ displayEditModel: false, selectedRowIndexes: [] })

            }
        })
    }


    render() {
        return (<div>
            
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">Linux Kernel</div>
                </Media>    
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media> 
            </Media>
            <div style={{height:'250px',overflowY:'scroll',marginBottom:'20px'}}>
            <SummaryDataTable key={this.counter++} heading={this.state.kernelHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
            </div>
            {this.renderUpgradeModelDialog()}
            {this.renderEditModelDialog()}
        </div>
        );
    }



}

export default LinuxKernel;