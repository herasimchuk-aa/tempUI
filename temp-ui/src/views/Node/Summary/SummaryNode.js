import React, { Component } from 'react';
import Styles from './Summary.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {ServerNode, ServerISO, ServerKernelTypes, ServerLabels, ServerSystemType, ServerAPI} from '../../../ServerAPI';
//import {ServerAPI} from '../../../ServerAPI';


//var SelectBox = React.createFactory(require('react-select-box'))
//import 'react-select-box';
//import Dropdown from 'react-dropdown-multiselect'

class SummaryNode extends React.Component {
    constructor(props) {
        super(props);
        //props.ModelDialogCallback((displayModel, modelTitle, modelDescription, confirmationCallback))
        //props.upgradeNodeCallback((node, updateKernel, updateISO))
        this.state = {
            node: props.nodeObj,
            upgradeInProgress: false,
            //selectedLabels:["spine", "leaf", "k8Master"],
            selectedISO: props.nodeObj.linuxISO,
            selectedKernel: props.nodeObj.kernel,
            upgradeISOTo: null,
            upgradeKernelTo: null,
            selectedSystemType: props.nodeObj.nodeType,
        };
        this.sbKernelSelectionChanged = this.sbKernelSelectionChanged.bind(this);
        this.sbISOSelectionChanged = this.sbISOSelectionChanged.bind(this);
        this.updateKernelConfirmation = this.updateKernelConfirmation.bind(this);
        this.updateISOConfiramation = this.updateISOConfiramation.bind(this);
    }

    componentDidMount() {
        //ServerAPI.DefaultServer().fetchNodes(this.updateNodeSummary, this);
        
    }

    componentWillUnmount() {
        
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.upgradeInProgress != nextProps.upgradeInProgress)
        {
            this.setState({
                upgradeInProgress: nextProps.upgradeInProgress,
            });
        }
    }

    updateKernelConfirmation(confirmed) {
        console.log("updateKernelConfirmation, " + confirmed);
        if (confirmed) {
            this.props.upgradeNodeCallback(this.state.node, true, this.state.upgradeKernelTo);
            this.setState({
                selectedKernel: this.state.upgradeKernelTo.value,
                upgradeInProgress: true,
            });
        }
    }

    updateISOConfiramation(confirmed) {
        console.log("updateISOConfiramation, " + confirmed);
        if (confirmed) {
            this.props.upgradeNodeCallback(this.state.node, false, this.state.upgradeISOTo);
            this.setState({
                selectedKernel: this.state.selectedISO.value,
                upgradeInProgress: true,
            });
        }
    }

    sbKernelSelectionChanged(obj) {
        console.log("Selection Changed for Kernel");
        this.state.upgradeKernelTo = obj;
        this.props.modelDialogCallback(true, "Upgrade Kernel", "Update Kernel from xxxx to yyyy.", this.updateKernelConfirmation);
    }

    sbISOSelectionChanged(obj) {
        console.log("Selection Changed for ISO");
        this.state.upgradeISOTo = obj;
        this.props.modelDialogCallback(true, "Upgrade ISO", "Update IOS from xxxx to yyyy.", this.updateISOConfiramation);
    }

    columnClassName(columnId, withSelection) {
        let active = true; //this.state.node%2;
        let colClasses = "Col-Content " + (active? "Content-Active ": "Content-InActive ");
        colClasses += "Col-Content" + columnId;
        if (withSelection) {
            colClasses += " Selection-DropDown";
        }
        return colClasses;
    }

    renderLinuxKernel(keyId) {
        if (!this.props.upgradeInProgress) {
            let kernels = ServerAPI.DefaultServer().allKernelTypes;
            return(<Select
                        key={keyId}
                        id={keyId}
                        name={keyId}
                        value={this.state.selectedKernel}
                        onChange={this.sbKernelSelectionChanged}
                        options={kernels}
                    />);
        } else {
            return(<div>{this.state.selectedKernel}</div>);
        }
    }

    renderLinuxISO(keyId) {
        if (!this.props.upgradeInProgress) {
            let isoS = ServerAPI.DefaultServer().allISOs;
            return(
                <Select
                    key={keyId}
                    id={keyId}
                    name={keyId}
                    value={this.state.selectedISO}
                    onChange={this.sbISOSelectionChanged}
                    options={isoS}
                />
            );
        } else {
            return(<div>{this.state.selectedISO}</div>);
        }
    }

    renderNode() {
        if(this.state.node.name != ""){
        let keyId = "NodeId_"+this.state.node.name;
        let selectId_1 = "SelectionNodeId_" + this.state.node.name + "_1";
        let selectId_2 = "SelectionNodeId_" + this.state.node.name + "_2";
        let selectId_3 = "SelectionNodeId_" + this.state.node.name + "_3";
        let selectedLabels = this.state.node.labels.join(", ");
        let topStyle = (this.props.nodePosition * 3) + 'px';
        let styleObj={top:topStyle};
        let goesVersion = this.state.node.goesVersion
        return (
            <div key={keyId} id={keyId} className="Row-Content" style={styleObj}>
                <div className={this.columnClassName(1, false)}>{this.state.node.name}<br/>{this.state.node.serialNumber}</div>
                <div className="Col-Sep Col-Sep1"></div>
                <div className={this.columnClassName(2, true)}>
                    {selectedLabels}
                </div>
                <div className="Col-Sep Col-Sep2"></div>
                <div className={this.columnClassName(3, false)}>{this.state.selectedSystemType}</div>
                <div className="Col-Sep Col-Sep3"></div>
                <div className={this.columnClassName(4, true)}>{this.renderLinuxKernel(selectId_2)}</div>
                <div className="Col-Sep Col-Sep4"></div>
                <div className={this.columnClassName(5, true)}>{this.renderLinuxISO(selectId_3)}</div>
                <div className="Col-Sep Col-Sep5"></div>
                <div className={this.columnClassName(6, false)}>32-Core / 128GB / 128GB</div>
                <div className="Col-Sep Col-Sep6"></div>
                <div className={this.columnClassName(7, false)}>{this.state.node.mainInterface.IPAddress}</div>
                <div className="Col-Sep Col-Sep7"></div>
                <div className={this.columnClassName(8, false)}>{this.state.node.goesVersion} /<br/>{this.state.node.coreBootVersion}</div>
                <div className="Col-Sep Col-Sep8"></div>
                <div className={this.columnClassName(9, false)}>{this.state.node.bmcInterface.IPAddress}</div>
                </div>
        );}
    }

    render() {
        return (
            <div>
                {this.renderNode()}
            </div>
        );
    }
}
export default SummaryNode;
