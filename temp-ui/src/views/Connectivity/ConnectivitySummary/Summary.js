import React from 'react';
import { Row } from 'reactstrap';
import { connectivityHead } from '../../../consts';
import '../../views.css';
import { FETCH_ALL_NODES } from '../../../apis/RestConfig';
import SummaryDataTable from '../../Node/NodeSummary/SummaryDataTable';
import { fetchNodes } from '../../../actions/nodeAction';
import { connect } from 'react-redux'

class ConnectivitySummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            connectivityHead: JSON.parse(JSON.stringify(connectivityHead)),
        }
    }

    componentDidMount() {
        this.props.fetchNodes(FETCH_ALL_NODES)

    }

    static getDerivedStateFromProps(props) {

        return {
            nodes: props.nodes ? props.nodes.toJS() : []
        }
    }

    render() {
        return (
            <div>
                <Row className="tableTitle">Connectivity Summary</Row>
                <SummaryDataTable heading={this.state.connectivityHead} data={this.state.nodes} showCheckBox={false} showCollapse={true}></SummaryDataTable>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConnectivitySummary);

