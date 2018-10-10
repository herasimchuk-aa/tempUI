import React from 'react';
import { Row } from 'reactstrap';
import { connectivityHead } from '../../../consts';
import '../../views.css';
import { FETCH_ALL_NODES } from '../../../apis/RestConfig';
import SummaryDataTable from '../../Node/NodeSummary/SummaryDataTable';
import { fetchNodes, setConnectivityHeadings } from '../../../actions/nodeAction';
import { connect } from 'react-redux'
import I from 'immutable'

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
            nodes: props.nodes ? props.nodes.toJS() : [],
            connectivityHead: props.headings ? props.headings.toJS() : connectivityHead,
        }
    }

    setConnectivityHeadings = (headings) => {
        this.props.setConnectivityHeadings(I.fromJS(headings))
    }

    render() {
        return (
            <div>
                <Row className="tableTitle">Connectivity Summary</Row>
                <SummaryDataTable heading={this.state.connectivityHead} setHeadings={this.setConnectivityHeadings} constHeading={connectivityHead} data={this.state.nodes} showCheckBox={false} showCollapse={true}></SummaryDataTable>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        nodes: state.nodeReducer.getIn(['nodes']),
        headings: state.nodeReducer.getIn(['connectivityHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchNodes: (url) => dispatch(fetchNodes(url)),
        setConnectivityHeadings: (headings) => dispatch(setConnectivityHeadings(headings))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectivitySummary);

