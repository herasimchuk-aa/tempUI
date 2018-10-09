import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { nodeHead } from '../../../consts';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import SearchComponent from '../../../components/SearchComponent/SearchComponent';
import '../../views.css';
import { FETCH_ALL_NODES } from '../../../apis/RestConfig';
import { fetchNodes } from '../../../actions/nodeAction';
import { connect } from 'react-redux'

class NodeOpSummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {},
            nodes: [],
            constNodes: [],
            nodeSummaryHead: JSON.parse(JSON.stringify(nodeHead)),
        }
    }

    componentDidMount() {
        this.props.fetchNodes(FETCH_ALL_NODES)
    }

    static getDerivedStateFromProps(props) {
        return { nodes: props.nodes ? props.nodes.toJS() : [] }
    }

    getFilteredData = (data) => {
        this.setState({ nodes: data })
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

function mapStateToProps(state) {
    return {
        nodes: state.nodeReducer.getIn(['nodes']),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchNodes: (url) => dispatch(fetchNodes(url)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeOpSummary);