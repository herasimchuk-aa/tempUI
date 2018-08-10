import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, ListGroup, ListGroupItem, UncontrolledCollapse, CardBody, Card } from 'reactstrap';
import '../../views/views.css';

const actualNode =
{
    serialNumber: 'ABC1757700008',
    nodeType: 'PS-3001',
    kernel: 'Wipe',
    linuxISO: 'Wipe',
    allInterfaces: [{
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: true,
        macAddress: "",
        port: "eth0",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth11",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth9",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth8",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth7",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth6",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth5",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth4",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth3",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth2",
        type: ""
    }, {
        admin: "",
        alarms: "",
        connectedTo: { name: "", port: "", link: "true", lldpMatched: "True" },
        link: "true",
        lldpMatched: "True",
        name: "",
        port: "",
        ip: "172.17.2.37",
        isMngmntIntf: false,
        macAddress: "",
        port: "eth1",
        type: ""
    }]
}

class DiscoverModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            existingNode: []
        }
    }

    static getDerivedStateFromProps(props, state) {
        return { isOpen: props.isOpen, existingNode: props.node }
    }

    cancel() {
        this.setState({ isOpen: false })
    }

    action(actualNode) {
        this.props.action(actualNode)
        this.setState({ isOpen: false })
    }

    // toggle(source) {
    //     var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    //     for (var i = 0; i < checkboxes.length; i++) {
    //         if (checkboxes[i] != source)
    //             checkboxes[i].checked = source.checked;
    //     }
    // }

    // 
    render() {
        let existingNode = this.state.existingNode[0]
        let existingInterfaces = existingNode.allInterfaces
        let actualInterfaces = actualNode.allInterfaces
        return (
            <Modal isOpen={this.state.isOpen} toggle={() => this.cancel()} size="lg" centered="true" >
                <ModalHeader toggle={() => this.cancel()}> Discover Node </ModalHeader>
                <ModalBody style={{ margin: '15px' }}>
                    <Row className="headerRow">
                        <Col sm="4" className="head-name">Fields</Col>
                        <Col sm="4" className="head-name">Existing values</Col>
                        <Col sm="4" className="head-name">Actual Values</Col>
                        {/* <Col sm="1" className="head-name"><Input className="form-check-input" onClick={this.toggle(this)} type="checkbox" id="all" name="all" defaultChecked={true} /></Col> */}
                    </Row>
                    <Row className="headerRow1 ">
                        <Col sm="4" className="head-name">Type</Col>
                        <Col sm="4" className="head-name">{existingNode.nodeType}</Col>
                        <Col sm="4" className="head-name">{actualNode.nodeType}</Col>
                        {/* <Col sm="1" className="head-name"><Input className="form-check-input" type="checkbox" id="type" name="type" defaultChecked={true} /></Col> */}
                    </Row>
                    <Row className="headerRow2 ">
                        <Col sm="4" className="head-name">Serial Number</Col>
                        <Col sm="4" className="head-name">{existingNode.serialNumber}</Col>
                        <Col sm="4" className="head-name">{actualNode.serialNumber}</Col>
                        {/* <Col sm="1" className="head-name"><Input className="form-check-input" type="checkbox" id="sn" name="sn" defaultChecked={true} /></Col> */}
                    </Row>
                    <Row className="headerRow1 ">
                        <Col sm="4" className="head-name">Linux kernel</Col>
                        <Col sm="4" className="head-name">{existingNode.kernel}</Col>
                        <Col sm="4" className="head-name">{actualNode.kernel}</Col>
                        {/* <Col sm="1" className="head-name"><Input className="form-check-input" type="checkbox" id="kernel" name="kernel" defaultChecked={true} /></Col> */}
                    </Row>
                    <Row className="headerRow2 ">
                        <Col sm="4" className="head-name">Base Linux Iso</Col>
                        <Col sm="4" className="head-name">{existingNode.linuxISO}</Col>
                        <Col sm="4" className="head-name">{actualNode.linuxISO}</Col>
                        {/* <Col sm="1" className="head-name"><Input className="form-check-input" type="checkbox" id="iso" name="iso" defaultChecked={true} /></Col> */}
                    </Row>
                    <Row className="headerRow1 headerRow3">
                        <Col sm="4" className="head-name">Interfaces</Col>
                        <Col sm="4" className="head-name" style={{ height: '200px', overflowY: 'scroll' }}>{existingInterfaces.map((item) => {
                            return (<ListGroup>
                                <ListGroupItem>
                                    {item.port}
                                </ListGroupItem>
                            </ListGroup>)
                        })}
                        </Col>
                        <Col sm="4" className="head-name" style={{ height: '200px', overflowY: 'scroll' }}>{actualInterfaces.map((item, index) => {
                            return (
                                <div>
                                    <ListGroup>
                                        <ListGroupItem>
                                            {item.port}
                                        </ListGroupItem>
                                    </ListGroup>
                                </div>)
                        })}</Col>
                        {/* <Col sm="1" className="head-name"><Input className="form-check-input" type="checkbox" id="interface" name="interface" defaultChecked={true} /></Col> */}
                    </Row>
                    <h4>Do you want to replace selected values ?</h4>
                </ModalBody>
                <ModalFooter>
                    <Button outline className="custBtn" color="primary" onClick={() => (this.action(actualNode))}>Yes</Button>
                    <Button outline className="custBtn" color="primary" onClick={() => (this.cancel())}>No</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default DiscoverModal