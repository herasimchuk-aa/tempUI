import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { kernelHead } from '../../../consts';
import { trimString } from '../../../components/Utility/Utility';
import { getRequest, postRequest } from '../../../apis/RestApi'
import { FETCH_ALL_KERNELS, ADD_KERNEL, DELETE_KERNELS } from '../../../apis/RestConfig'
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
            visible: false
        }
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
            let failedIds = data.Data.Failure
            if (failedIds && failedIds.length) {
                failedIds.map((item) => {
                    self.state.data.find((kernel) => {
                        if (item == kernel.Id) {
                            NotificationManager.error(kernel.Name + " is in use", "Kernel")
                        }
                    })

                })
            }
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


    render() {
        return (<div>
            <div className='marginLeft10'>
                <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                {this.showDeleteButton()}
            </div>
            <Row className="tableTitle">Linux Kernel</Row>
            <SummaryDataTable heading={this.state.kernelHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
            {this.renderUpgradeModelDialog()}
        </div>
        );
    }



}

export default LinuxKernel;