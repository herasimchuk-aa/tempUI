import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { isoHead } from '../../../consts';

class BaseLinuxIso extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isoHead: isoHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            visible: false
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllIso(this.retrieveData, this);
    }

    retrieveData(instance, data) {
        if (!data) {
            alert("No data received");
        }
        else {
            instance.setState({ data: data, selectedRowIndexes: [] });
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


    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteISO())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteISO() {
        for (let i = 0; i < this.state.selectedRowIndexes.length; i++) {
            ServerAPI.DefaultServer().deleteIso(this.callbackDelete, this, this.state.data[this.state.selectedRowIndexes[i]].label);
        }
        this.setState({ showDelete: !this.state.showDelete, selectedRowIndexes: [] });
    }

    callbackDelete(instance, data) {
        ServerAPI.DefaultServer().fetchAllIso(instance.retrieveData, instance);
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Base Linux ISO</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name <Input autoFocus className="marTop10" id='isoName' /><br />
                        Location <Input className="marTop10" id='isoLoc' /><br />
                        Description <Input className="marTop10" id='isoDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addIso())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel })
    }

    addIso() {
        if (!document.getElementById('isoName').value) {
            this.setState({ visible: true });
            return;
        }
        let a = {
            'Name': document.getElementById('isoName').value,
            'Location': document.getElementById('isoLoc').value,
            'Description': document.getElementById('isoDesc').value
        }
        ServerAPI.DefaultServer().addIso(this.callback, this, a);
    }

    callback(instance, data) {
        let a = instance.state.data
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel })
    }


    render() {
        return (
            <div>
                <div className='marginLeft10'>
                    <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                    {this.showDeleteButton()}
                </div>
                <Row className="tableTitle">Base Linux ISO</Row>
                <SummaryDataTable heading={this.state.isoHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.renderUpgradeModelDialog()}
            </div>
        );
    }



}

export default BaseLinuxIso;