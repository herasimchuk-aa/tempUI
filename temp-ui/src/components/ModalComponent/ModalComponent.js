import React, { Component } from 'react'
import { validateIPaddress, trimString } from '../Utility/Utility';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, ListGroupItem, ListGroup, Row, Col } from 'reactstrap';

class ModalComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            port: '',
            ip: '',
            subnet: '',
            remoteName: '',
            remoteInterface: '',
            speed: '',
            autoNEG: false,
            fecType: '',
            mediaType: '',
            isMngmntIntf: false,
            id: 0,
            error: []
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.data) {
            return
        }
        let serverName = props.data.Remote_node_name
        let ip = props.data.Ip_address
        let serverPort = props.data.Remote_interface;
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
            id: props.data.Id,
            port: props.data.Name,
            ip: ip,
            subnet: props.data.Subnet,
            speed: props.data.Speed,
            autoNEG: props.data.Autoneg,
            fecType: props.data.FecType,
            mediaType: props.data.MediaType,
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
            'Id': this.state.id++,
            'Remote_node_name': document.getElementById('remoteName').value,
            'Remote_interface': document.getElementById('remoteInterface').value,
            'Ip_address': ipAddress,
            'Name': validInterfacename,
            'Subnet': document.getElementById('subnet').value,
            'Speed': document.getElementById('speed').value,
            'FecType': document.getElementById('fecType').value,
            'MediaType': document.getElementById('mediaType').value,
            'Autoneg': document.getElementById('autoNeg').checked,
            'Is_management_interface': document.getElementById('mngmntInt').checked,
        }


        this.props.getData(newInterface)
    }

    cancelAlert = () => {
        this.setState({ showAlert: false });
    }

    closeModal() {
        this.setState({ open: false })
        this.props.cancel()
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
            <Modal isOpen={this.state.open} toggle={() => this.closeModal()} size="lg" centered="true" >
                <ModalHeader toggle={() => this.closeModal()}>{this.props.actionButton} Interface </ModalHeader>
                {errorAlert}
                <ModalBody>
                    <Row>
                        <Col>Name<font color="red"><sup>*</sup></font> <Input className="marTop10" autoFocus type="text" id="port" defaultValue={this.state.port} /></Col>
                        <Col>IP Address<font color="red"><sup>*</sup></font><Input className="marTop10" type="text" id="ip" defaultValue={this.state.ip} /></Col>
                        <Col>Subnet<font color="red"><sup>*</sup></font><Input className="marTop10" type="text" id="subnet" defaultValue={this.state.subnet} /></Col>
                    </Row>
                    <Row className="marTop10">
                        <Col>Speed<Input className="marTop10" type="text" id="speed" defaultValue={this.state.speed} /></Col>
                        <Col>FEC<Input className="marTop10" type="text" id="fecType" defaultValue={this.state.fecType} /></Col>
                        <Col>Media<Input className="marTop10" type="text" id="mediaType" defaultValue={this.state.mediaType} /></Col><br />
                    </Row>
                    <Row className="marTop10">
                        <Col>Remote Node Name<Input className="marTop10" type="text" id="remoteName" defaultValue={this.state.remoteName} /></Col>
                        {/* <Col></Col> */}
                        <Col>Remote Node Interface<Input className="marTop10" type="text" id="remoteInterface" defaultValue={this.state.remoteInterface} /></Col><br />
                    </Row>
                    <Row className="marTop10">
                        <Col><input className="marTop10" type="checkbox" id="autoNeg" defaultChecked={this.state.autoNEG} /> AutoNEG</Col><br />
                        {/* <Col></Col> */}
                        <Col><input className="marTop10" type="checkbox" id="mngmntInt" defaultChecked={this.state.isMngmntIntf} /> Management Interface</Col>
                    </Row>

                    {/* <div className="marTop10">Name<font color="red"><sup>*</sup></font> <Input autoFocus type="text" id="port" defaultValue={this.state.port} /></div>
                    <div className="marTop10">IP Address<font color="red"><sup>*</sup></font><Input type="text" id="ip" defaultValue={this.state.ip} /></div>
                    <div className="marTop10">Remote Node Name<Input type="text" id="remoteName" defaultValue={this.state.remoteName} /></div>
                    <div className="marTop10">Remote Node Interface<Input type="text" id="remoteInterface" defaultValue={this.state.remoteInterface} /></div>
                    <div className="marTop10"><input type="checkbox" id="mngmntInt" defaultChecked={this.state.isMngmntIntf} /> Management Interface</div> */}
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