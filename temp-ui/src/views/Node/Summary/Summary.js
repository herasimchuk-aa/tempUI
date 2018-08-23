import React from 'react';
import Styles from './Summary.css';
import {HostStats, Host, ServerAPI} from '../../../ServerAPI';
import SummaryNode from './SummaryNode'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

class Summary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes : [],
            displayModel: false,
            modelTitle: "",
            modelDescription: "",
            modelConfirmationCallBack: null,
        };
        this.updateNodeSummary = this.updateNodeSummary.bind(this);
        this.displayModelDialog = this.displayModelDialog.bind(this);
        this.upgradeNode = this.upgradeNode.bind(this);
        this.cancelUpgrade = this.cancelUpgrade.bind(this);
        this.upgradeConfirmation = this.upgradeConfirmation.bind(this);
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.updateNodeSummary, this);
    }

    componentWillUnmount() {
        
    }

    updateNodeSummary(instance, nodes) {
        instance.setState({
            nodes: nodes,
        });
    }

    cancelUpgrade() {
        let confirmationCallback = this.state.modelConfirmationCallBack;
        this.setState({
            displayModel: false,
            modelTitle: "",
            modelDescription: "",
            modelConfirmationCallBack: null,
        });
        confirmationCallback(false);
    }

    upgradeConfirmation() {
        let confirmationCallback = this.state.modelConfirmationCallBack;
        this.setState({
            displayModel: false,
            modelTitle: "",
            modelDescription: "",
            modelConfirmationCallBack: null,
        });
        confirmationCallback(true);
    }

    displayModelDialog(displayModel, modelTitle, modelDescription, confirmationCallback) {
        this.setState({
            displayModel: displayModel,
            modelTitle: modelTitle,
            modelDescription: modelDescription,
            modelConfirmationCallBack: confirmationCallback,
        });
    }
    
    upgradeNodeConfirmationCallback(wipeInfo) {
        console.log("Updated :: " + wipeInfo);
    }

    upgradeNode(node, updateKernel, updateObject) {
        console.log(node + ", " + updateKernel + ", " + updateObject);
        //MN:: TODO:: API Server call for Upgrade....
        ServerAPI.DefaultServer().upgradeOrWipeServerNode(node, this.upgradeNodeConfirmationCallback, this);
    }

    renderNodesHeader() {
        return (
            <div key="node_header_id" className="SummaryHeaderView">
                <div className="Row">
                    <div className="Col-Header Col-Content1">Name/<br/>Serial Number</div>
                    <div className="Col-Header Col-Content2">Labels</div>
                    <div className="Col-Header Col-Content3">Type</div>
                    <div className="Col-Header Col-Content4">Linux Kernel</div>
                    <div className="Col-Header Col-Content5">Base Linux ISO</div>
                    <div className="Col-Header Col-Content6">CPU - Memory - Storage</div>
                    <div className="Col-Header Col-Content7">DNS Name</div>
                    <div className="Col-Header Col-Content8">GOES/<br/>CoreBoot<br/>Version</div>
                    <div className="Col-Header Col-Content9">BMC<br/>IP<br/>Address</div>
                </div>
            </div>
        );
    }
    
    renderNodesContent() {
        return (
            <div className="SummaryContentView">
                {this.renderNodes()}
            </div>
        );
    }
    
    renderNodes() {
        let retHTML = [];
        let nodePos = 1;
        for (let nodeId in this.state.nodes) {
            let node = this.state.nodes[nodeId];
            retHTML.push(
                <SummaryNode serverObj={ServerAPI.DefaultServer()} nodeObj={node} nodePosition={nodePos} upgradeInProgress={false} modelDialogCallback={this.displayModelDialog} upgradeNodeCallback={this.upgradeNode}/>
            );
            nodePos++;
        }
        return retHTML;
    }
    
    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} size="sm" centered="true" >
                    <ModalHeader toggle={this.toggleCreateHost}>{this.state.modelTitle}</ModalHeader>
                    <ModalBody>{this.state.modelDescription}</ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={this.upgradeConfirmation}>Upgrade</Button>{'  '}
                        <Button outline color="secondary" onClick={this.cancelUpgrade}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }
    
    render() {
        return (
            <div>
                {this.renderUpgradeModelDialog()}
                {this.renderNodesHeader()}
                {this.renderNodesContent()}
            </div>
        );
    }
}
export default Summary;