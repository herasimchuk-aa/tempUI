import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { kernelHead } from '../../../consts';
import { trimString } from '../../../components/Utility/Utility';

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
        ServerAPI.DefaultServer().fetchAllKernels(this.retrieveData, this);
    }

    retrieveData(instance, data) {
        if (!data) {
            alert("No data received");
        }
        else {
            instance.setState({ data: data, selectedRowIndexes: [] });
        }
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
        for (let i = 0; i < this.state.selectedRowIndexes.length; i++) {
            ServerAPI.DefaultServer().deleteKernel(this.callbackDelete, this, this.state.data[this.state.selectedRowIndexes[i]].label);
        }
        this.setState({ showDelete: !this.state.showDelete, selectedRowIndexes: [] });
    }

    callbackDelete(instance) {
        ServerAPI.DefaultServer().fetchAllKernels(instance.retrieveData, instance);
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
        let kernel = document.getElementById('kernelName').value
        let validKernel = trimString(kernel)
        if (!validKernel) {
            this.setState({ visible: true })
            return;
        }
        let a = {
            'Name': validKernel,
            'Location': document.getElementById('kernelLoc').value,
            'Description': document.getElementById('kernelDesc').value
        }
        ServerAPI.DefaultServer().addKernel(this.callback, this, a);
    }

    callback(instance, data) {
        let a = instance.state.data
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel, visible: false })
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