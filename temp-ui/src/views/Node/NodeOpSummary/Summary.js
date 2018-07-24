import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import '../../views.css';

class NodeOpSummary extends React.Component {

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
            <Col sm="2" className="head-name">Name/Serial Number</Col>
            <Col sm="1" className="head-name">Labels</Col>
            <Col sm="1" className="head-name">Type</Col>
            <Col sm="1" className="head-name">Linux Kernel</Col>
            <Col sm="1" className="head-name">Base Linux ISO</Col>
            <Col sm="2" className="head-name">CPU-Memory-Storage</Col>
            <Col sm="1" className="head-name">DNS name</Col>
            <Col sm="2" className="head-name">GOES/CoreBoot Version</Col>
            <Col sm="1" className="head-name">BMC IP Address</Col>
        </Row>)
    }

    drawtable() {
        let data = this.state.nodes
        console.log(data)
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
                let row = (<Row className={row1}>
                    <Col sm="2" className="pad">{node.name ? node.name : '-'} / {node.serialNumber ? node.serialNumber : '-'}</Col> 
                    <Col sm="1" className="pad">{node.labels ? node.labels : '-'}</Col>
                    <Col sm="1" className="pad">{node.nodeType ? node.nodeType : '-'}</Col>
                    <Col sm="1" className="pad">{node.kernel == '---Select an Option---' || null ? '-' : node.kernel}</Col>
                    <Col sm="1" className="pad">{node.linuxISO == '---Select an Option---' || null ? '-'  : node.linuxISO}</Col>
                    <Col sm="2" className="pad">{node.cpuInGHz} - {node.memoryInGB} - {node.storageInGB}</Col>
                    <Col sm="1" className="pad">{node.dnsName ? node.dnsName : '-' }</Col>
                    <Col sm="2" className="pad">{node.goesVersion ? node.goesVersion : '-'} / {node.coreBootVersion ? node.coreBootVersion : '-'}</Col>
                    <Col sm="1" className="pad">{node.bmcInterface.IPAddress ? node.bmcInterface.IPAddress : '-'}</Col>
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
                {table}
            </div>
        );
    }

}

export default NodeOpSummary;
