import React, { Component } from 'react'
import { validateIPaddress, trimString } from '../Utility/Utility';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, ListGroupItem, ListGroup } from 'reactstrap';

class ModalComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            port: '',
            ip: '',
            remoteName: '',
            remoteInterface: '',
            isMngmntIntf: false,
            error: []
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.data) {
            return
        }
        let serverName = props.data.connectedTo.serverName
        let ip = props.data.IPAddress
        let serverPort = props.data.connectedTo.serverPort;
        if (!serverName) {
            serverName = ''
        }
        if (!ip) {
            ip = ''
        }
        if (!serverPort) {
            serverPort = ''
        }
        return {
            port: props.data.port,
            ip: ip,
            remoteName: serverName,
            remoteInterface: serverPort,
            isMngmntIntf: props.data.isMngmntIntf
        }
    }
    getdata = () => {
        let interfaceName = document.getElementById('port').value
        let validInterfacename = trimString(interfaceName)
        let error = []
        if (!validInterfacename) {
            error.push('Name field is mandatory')
        }

        let ipAddress = document.getElementById('ip').value
        let validIp = validateIPaddress(ipAddress)
        if (!validIp) {
            error.push('Please add correct IP Address')
        }

        if (error.length) {
            this.setState({ error: error, showAlert: true })
            return
        }

        let newInterface = {
            'connectedTo': {
                'serverName': document.getElementById('remoteName').value,
                'serverPort': document.getElementById('remoteInterface').value
            },
            'IPAddress': ipAddress,
            'port': validInterfacename,
            'isMngmntIntf': document.getElementById('mngmntInt').checked,
        }

        this.props.getData(newInterface)
    }

    cancelAlert = () => {
        this.setState({ showAlert: false });
    }

    closeModal() {
        this.setState({ open: false })
        this.props.cancel();
    }

    render() {
        let errorAlert = null
        if (this.state.error.length) {
            errorAlert = <Alert color="danger" isOpen={this.state.showAlert} toggle={this.cancelAlert}>
                {this.state.error.map((err) => {
                    return <ListGroup><ListGroupItem>{err}</ListGroupItem> </ListGroup>
                })}
            </Alert>
        }
        return (
            <Modal isOpen={this.state.open} toggle={() => this.closeModal()} size="sm" centered="true" >
                <ModalHeader toggle={() => this.closeModal()}>{this.props.actionButton} Interface </ModalHeader>
                {errorAlert}
                <ModalBody>
                    <div className="marTop10">Name<font color="red"><sup>*</sup></font> <Input autoFocus type="text" id="port" defaultValue={this.state.port} /></div>
                    <div className="marTop10">IP Address<font color="red"><sup>*</sup></font><Input type="text" id="ip" defaultValue={this.state.ip} /></div>
                    <div className="marTop10">Remote Node Name<Input type="text" id="remoteName" defaultValue={this.state.remoteName} /></div>
                    <div className="marTop10">Remote Node Interface<Input type="text" id="remoteInterface" defaultValue={this.state.remoteInterface} /></div>
                    <div className="marTop10"><input type="checkbox" id="mngmntInt" defaultChecked={this.state.isMngmntIntf} /> Management Interface</div>
                </ModalBody>
                <ModalFooter>
                    <Button outline className="custBtn" color="primary" onClick={() => (this.getdata())}>{this.props.actionButton}</Button>
                    <Button outline className="custBtn" color="primary" onClick={() => (this.closeModal())}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalComponent