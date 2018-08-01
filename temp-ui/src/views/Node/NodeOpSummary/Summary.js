import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import { nodeHead } from '../../../consts';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import SearchComponent from '../../../components/SearchComponent/SearchComponent';
import '../../views.css';

class NodeOpSummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {},
            nodes: [],
            constNodes: [],
            nodeSummaryHead: nodeHead
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.updateNodeSummary, this);
    }

    updateNodeSummary = (instance, nodes) => {
        instance.setState({
            nodes: nodes,
            constNodes: Object.assign([], nodes)
        });
    }

    getFilteredData = (data) => {
        this.setState({
            nodes: data
        })
    }

    render() {

        return (
            <div>
                <div style={{ float: 'right', marginBottom: '10px' }}>
                    <SearchComponent data={this.state.constNodes} getFilteredData={this.getFilteredData} />
                </div>
                <div style={{ clear: 'both' }}></div>
                <Row className="tableTitle">Node Summary</Row>

                <SummaryDataTable heading={this.state.nodeSummaryHead} data={this.state.nodes} showCheckBox={false} />

            </div>
        );
    }

}

export default NodeOpSummary;
