import React from 'react';
import { Row } from 'reactstrap';
import { nodeHead } from '../../../consts';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import SearchComponent from '../../../components/SearchComponent/SearchComponent';
import '../../views.css';
import { FETCH_ALL_NODES } from '../../../apis/RestConfig';
import { fetchNodes, setNodeHeadings } from '../../../actions/nodeAction';
import { connect } from 'react-redux'
import I from 'immutable'

class NodeOpSummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {},
            nodes: [],
            constNodes: []
        }
    }

    componentDidMount() {
        this.props.fetchNodes(FETCH_ALL_NODES)
    }

    static getDerivedStateFromProps(props) {
        return {
            nodes: props.nodes ? props.nodes.toJS() : [],
            constNodes: props.nodes ? props.nodes.toJS() : [],
            nodeSummaryHead: props.headings ? props.headings.toJS() : nodeHead,
        }
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
                <SummaryDataTable
                    heading={this.state.nodeSummaryHead}
                    data={this.state.nodes}
                    showCheckBox={false}
                    setHeadings={(headings) => this.props.setNodeHeadings(I.fromJS(headings))}
                    constHeading={nodeHead}
                    tableName={"nodeSummaryTable"} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        nodes: state.nodeReducer.getIn(['nodes']),
        headings: state.nodeReducer.getIn(['nodeHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchNodes: (url) => dispatch(fetchNodes(url)),
        setNodeHeadings: (params) => dispatch(setNodeHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeOpSummary);