import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import { nodeHead } from '../../../consts';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import '../../views.css';

class NodeOpSummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {},
            nodes: [],
            nodeSummaryHead: nodeHead
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
            <Col sm="2" className="head-name">Name</Col>
            <Col sm="1" className="head-name">Site</Col>
            <Col sm="1" className="head-name">Status</Col>
            <Col sm="1" className="head-name">Roles</Col>
            <Col sm="1" className="head-name">Type</Col>
            <Col sm="2" className="head-name">Serial Number</Col>
            <Col sm="1" className="head-name">Linux Kernel</Col>
            <Col sm="2" className="head-name">Base linux ISO</Col>
            <Col sm="1" className="head-name">BMC IP Address</Col>
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
                let row = (<Row className={row1}>
                    <Col sm="2" className="pad break-word">{node.name ? node.name : '-'} </Col>
                    <Col sm="1" className="pad break-word">{node.site ? node.site : '-'}</Col>
                    <Col sm="1" className="pad break-word">{node.status ? node.status : '-'}</Col>
                    <Col sm="1" className="pad break-word" >
                        {node.roles ? node.roles.map((role, index) => {
                            if (index == node.roles.length - 1) {
                                return role
                            }
                            else {
                                return role + ','
                            }
                        })
                            : '-'}
                    </Col>
                    <Col sm="1" className="pad break-word">{node.nodeType == '' ? '-' : node.nodeType}</Col>
                    <Col sm="2" className="pad break-word">{node.serialNumber ? node.serialNumber : '-'}</Col>
                    <Col sm="1" className="pad break-word">{node.kernel == '' || null ? '-' : node.kernel}</Col>
                    <Col sm="2" className="pad break-word">{node.linuxISO == '' || null ? '-' : node.linuxISO}</Col>
                    <Col sm="1" className="pad break-word">{node.bmcInterface.IPAddress ? node.bmcInterface.IPAddress : '-'}</Col>
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
                <Row className="tableTitle">Node Summary</Row>
                <SummaryDataTable heading={this.state.nodeSummaryHead} data={this.state.nodes} />
                {/* {table} */}
            </div>
        );
    }

}

export default NodeOpSummary;
