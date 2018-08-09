import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem, Badge, UncontrolledTooltip } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import '../../views.css';

class ConnectivitySummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {},
            nodes: []
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.updateNodeSummary, this);
    }

    updateNodeSummary = (instance, nodes) => {
        instance.setState({
            nodes: nodes,
        });
    }

    drawHeader() {
        return (<Row className="headerRow">
            <Col sm="1" className="head-name">Name</Col>
            <Col sm="1" className="head-name">Status</Col>
            <Col sm="1" className="head-name">Roles</Col>
            <Col sm="1" className="head-name">Type</Col>
            <Col sm="1" className="head-name" style={{ textAlign: "center" }}>Interfaces</Col>
            <Col sm="1" className="head-name" style={{ textAlign: "center" }}>IP Address</Col>
            <Col sm="2" className="head-name" style={{ textAlign: "center" }}>Connected To</Col>
            <Col sm="1" className="head-name">Admin</Col>
            <Col sm="1" className="head-name">Link</Col>
            <Col sm="1" className="head-name">LLDP matched</Col>
            <Col sm="1" className="head-name">Interfaces Alarms</Col>
        </Row>)
    }

    drawtable() {
        let data = this.state.nodes
        let rows = []
        let header = this.drawHeader()
        rows.push(header)
        if (data && data.length) {
            let nodes = data;
            nodes.map((node, i) => {
                let row1 = 'headerRow1'

                if (i % 2 === 0) {
                    row1 = 'headerRow2'
                }
                if (i == nodes.length - 1) {
                    row1 = row1 + ' headerRow3 '
                }
                let allInterfaces = node.allInterfaces
                let allIntfDiv = "-"
                let allIntIPDiv = "-"
                let allIntConnDiv = "-"
                let allLinkDiv = "-"
                let allLldpMatchDiv = "-"
                let allAlarmDiv = "-"
                let allAdminDiv = "-"
                if (allInterfaces && allInterfaces.length) {
                    allIntfDiv = allInterfaces.map((interfaceItem) => {
                        return (
                            <ListGroup><ListGroupItem>{interfaceItem.port ? interfaceItem.port : '-'}</ListGroupItem></ListGroup>
                        )
                    })

                    allIntIPDiv = allInterfaces.map((interfaceItem, index) => {
                        let ipFont = "-";
                        let color = "black"
                        if (interfaceItem.IPAddress) {
                            if (node.validationStatus && node.validationStatus.interfacesStatus && Object.keys(node.validationStatus.interfacesStatus).length) {
                                let portName = interfaceItem.port
                                if (node.validationStatus.interfacesStatus[portName] && node.validationStatus.interfacesStatus[portName].isValidIP) {
                                    color = "black"
                                }
                                else {
                                    color = "red"
                                }
                            }
                            ipFont = (<font color={color}>{interfaceItem.IPAddress}</font>)
                        }
                        return (
                            <ListGroup>
                                <ListGroupItem>
                                    {ipFont}
                                </ListGroupItem>
                            </ListGroup>
                        )
                    })
                    allAdminDiv = allInterfaces.map((interfaceItem) => {
                        return (
                            <ListGroup><ListGroupItem>{interfaceItem.admin ? interfaceItem.admin : '-'}</ListGroupItem></ListGroup>
                        )
                    })
                    allAlarmDiv = allInterfaces.map((interfaceItem) => {
                        return (

                            <ListGroup><ListGroupItem>{interfaceItem.alarms ? interfaceItem.alarms : '-'}</ListGroupItem></ListGroup>
                        )
                    })

                    allIntConnDiv = allInterfaces.map((interfaceItem) => {
                        let connectedToData = '-'
                        if (interfaceItem.connectedTo.serverName && interfaceItem.connectedTo.serverPort) {
                            if (interfaceItem.connectedTo.lldpMatched == true || interfaceItem.connectedTo.lldpMatched == 'True') {
                                color = "black"
                            }
                            else if (interfaceItem.connectedTo.lldpMatched == false || interfaceItem.connectedTo.lldpMatched == 'False') {
                                color = "red"
                            }
                            connectedToData = (<font color={color}>{interfaceItem.connectedTo.serverName + " : " + interfaceItem.connectedTo.serverPort}</font>)
                        }
                        return (
                            <ListGroup><ListGroupItem>{connectedToData}</ListGroupItem></ListGroup>
                        )
                    })

                    allLinkDiv = allInterfaces.map((interfaceItem) => {
                        let linkData = '-'
                        if (interfaceItem.connectedTo.link == true || interfaceItem.connectedTo.link.toLowerCase() == "true")
                            linkData = "True"
                        else if (interfaceItem.connectedTo.link == false || interfaceItem.connectedTo.link.toLowerCase() == "false")
                            linkData = "False"
                        return (
                            <ListGroup><ListGroupItem>{linkData}</ListGroupItem></ListGroup>
                        )
                    })
                    allLldpMatchDiv = allInterfaces.map((interfaceItem) => {
                        let lldpData = '-'
                        if (!interfaceItem.isMngmntIntf) {
                            if (interfaceItem.connectedTo.lldpMatched == true ||
                                interfaceItem.connectedTo.lldpMatched == false ||
                                interfaceItem.connectedTo.lldpMatched == 'True' ||
                                interfaceItem.connectedTo.lldpMatched == 'False') {
                                if (!interfaceItem.connectedTo.lldpMatched == '')
                                    lldpData = interfaceItem.connectedTo.lldpMatched
                            }
                        }
                        return (
                            <ListGroup><ListGroupItem>{lldpData}</ListGroupItem></ListGroup>
                        )

                        /*let lldpFont = "-";
                        let color = "black"
                        if (interfaceItem.connectedTo.lldpMatched) {
                            if (node.validationStatus && node.validationStatus.interfacesStatus && Object.keys(node.validationStatus.interfacesStatus).length) {
                                let portName = interfaceItem.port
                                if (node.validationStatus.interfacesStatus[portName] && node.validationStatus.interfacesStatus[portName].isLLDPMatched) {
                                    color = "black"
                                }
                                else {
                                    color = "red"
                                }
                            }
                            lldpFont = (<font color={color}>{interfaceItem.connectedTo.lldpMatched}</font>)
                        }
                        return (
                            <ListGroup>
                                <ListGroupItem>
                                    {lldpFont}
                                </ListGroupItem>
                            </ListGroup>
                        ) */
                    })
                }
                let nodeTypeData = [];
                let color = ""
                if (node.nodeType) {
                    let tooltipId = 'type' + i;
                    if (node.validationStatus && node.validationStatus.isTypeMatched) {
                        color = "black"
                    } else {
                        color = "red"
                        if (node.validationStatus.type)
                            nodeTypeData.push(<UncontrolledTooltip placement="top" target={tooltipId}>{node.validationStatus.type}</UncontrolledTooltip>)
                    }
                    nodeTypeData.push(<font id={tooltipId} color={color}>{node.nodeType}</font>)
                }
                else {
                    nodeTypeData = '-'
                }
                let nodeStatusData = node.status;
                if (node.status == "Mismatch") {
                    nodeStatusData = (<Badge color="danger">{node.status}</Badge>)
                }
                let rolesData = ''
                if (node.roles) {
                    node.roles.map((val, index) => {
                        if (index == node.roles.length - 1) {
                            rolesData += val
                        }
                        else {
                            rolesData += val + ', '
                        }
                    })
                }
                else {
                    rolesData = '-'
                }
                let row = (<Row className={row1}>
                    <Col sm="1" className="pad">{node.name ? node.name : '-'}</Col>
                    <Col sm="1" className="pad">{nodeStatusData}</Col>
                    <Col sm="1" className="pad">{rolesData}</Col>
                    <Col sm="1" className="pad">{nodeTypeData}</Col>
                    <Col sm="1" className="pad" style={{ textAlign: "center" }}>
                        {allIntfDiv}
                    </Col>
                    <Col sm="1" className="pad" style={{ textAlign: "center" }}>
                        {allIntIPDiv}
                    </Col>
                    <Col sm="2" className="pad" style={{ textAlign: "center" }}>
                        {allIntConnDiv}
                    </Col>
                    <Col sm="1" className="pad">{allAdminDiv}</Col>
                    <Col sm="1" className="pad">{allLinkDiv}</Col>
                    <Col sm="1" className="pad">{allLldpMatchDiv}</Col>
                    <Col sm="1" className="pad">{allAlarmDiv}</Col>
                </Row>)
                rows.push(row)

            })
        }
        return rows
    }

    render() {
        let table = this.drawtable()
        return (
            <div>
                <Row className="tableTitle">Connectivity Summary</Row>
                {table}
            </div>
        );
    }

}

export default ConnectivitySummary;
