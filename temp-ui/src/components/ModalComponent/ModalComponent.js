import React, { Component } from 'react'
import { validateIPaddress, trimString } from '../Utility/Utility';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, ListGroupItem, ListGroup, Row, Col } from 'reactstrap';
import DropDown from '../dropdown/DropDown'

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
            // speed: '',
            // autoNEG: false,
            // fecType: '',
            // mediaType: '',
            isMngmntIntf: false,
            id: 0,
            error: [],
            selectedSpeed: '',
            selectedFec: '',
            selectedMedia: ''
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
            selectedSpeed: props.data.Speed,
            // autoNEG: props.data.Autoneg,
            selectedFec: props.data.FecType,
            selectedMedia: props.data.MediaType,
            remoteName: serverName,
            remoteInterface: serverPort,
            isMngmntIntf: props.data.isMngmntIntf
        }
    }

    getSelectedData = (data, identity) => {
        if (identity == 'Speed') {
            this.setState({ selectedSpeed: data })
            return
        }
        if (identity == 'Fec') {
            this.setState({ selectedFec: data })
            return
        }
        if (identity == 'Media') {
            this.setState({ selectedMedia: data })
            return
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
            'Speed': this.state.selectedSpeed,
            'FecType': this.state.selectedFec,
            'MediaType': this.state.selectedMedia,
            // 'Autoneg': document.getElementById('autoNeg').checked,
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
                        <Col>Speed<DropDown options={this.props.speedData} getSelectedData={this.getSelectedData} identity={"Speed"} default={this.state.selectedSpeed} /></Col>
                        <Col>FEC<DropDown options={this.props.fecData} getSelectedData={this.getSelectedData} identity={"Fec"} default={this.state.selectedFec} /></Col>
                        <Col>Media<DropDown options={this.props.mediaData} getSelectedData={this.getSelectedData} identity={"Media"} default={this.state.selectedMedia} /></Col><br />
                    </Row>
                    <Row className="marTop10">
                        <Col>Remote Node Name<Input className="marTop10" type="text" id="remoteName" defaultValue={this.state.remoteName} /></Col>
                        {/* <Col></Col> */}
                        <Col>Remote Node Interface<Input className="marTop10" type="text" id="remoteInterface" defaultValue={this.state.remoteInterface} /></Col><br />
                    </Row>
                    <Row className="marTop10">
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