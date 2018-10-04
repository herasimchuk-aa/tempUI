import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { ethHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi'
import { FETCH_ALL_ETHTOOL, ADD_ETHTOOL, UPDATE_ETHTOOL, DELETE_ETHTOOL } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getEthTool } from '../../../actions/ethToolAction';

class EthTool extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            ethHead: ethHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getEthTool(FETCH_ALL_ETHTOOL)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : []
        }
    }

    drawHeader() {
        return (<Row className="headerRow">
            <Col sm="1" className="head-name">  </Col>
            <Col sm="4" className="head-name">Name</Col>
            <Col sm="4" className="head-name">Description</Col>
            {/* <Col sm="4" className="head-name">Applicable Type</Col> */}
        </Row>)
    }

    checkBoxClick = (rowIndex) => {
        let { selectedRowIndexes } = this.state
        let arrayIndex = selectedRowIndexes.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndexes.splice(arrayIndex, 1)
        } else {
            selectedRowIndexes.push(rowIndex)
        }
        if (this.state.selectedRowIndexes.length > 0) {
            this.setState({ showDelete: true });
        }
        else {
            this.setState({ showDelete: false });
        }
    }


    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteEth())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteEth() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        postRequest(DELETE_ETHTOOL, deleteIds).then(function (data) {
            let failedEth = []
            failedEth = getNameById(data.Data.Failure, self.state.data);
            failedEth.map((item) => {
                NotificationManager.error(item + ' is in use', "ETHTOOL")
            })
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.props.getEthTool(FETCH_ALL_ETHTOOL);
        })
    }


    // drawtable() {
    //     let { data } = this.state
    //     let rows = []
    //     let header = this.drawHeader()
    //     rows.push(header)
    //     if (data && data.length) {
    //         let kernel = data;
    //         kernel.map((linuxKernel, i) => {
    //             let row1 = 'headerRow2'

    //             if (i % 2 === 0) {
    //                 row1 = 'headerRow1'
    //             }
    //             if (i == kernel.length - 1) {
    //                 row1 = row1 + ' headerRow3 '
    //             }
    //             let row = (<Row className={row1}>
    //                 <Col sm="1" className="pad"><Input className="marLeft40" type="checkbox" onChange={() => (this.checkBoxClick(i))}></Input></Col>
    //                 <Col sm="4" className="pad">{linuxKernel.label}</Col>
    //                 <Col sm="4" className="pad">{linuxKernel.description}</Col>
    //                 {/* <Col sm="4" className="pad">{linuxKernel.value}</Col> */}
    //             </Row>)
    //             rows.push(row)
    //         })
    //     }
    //     return rows
    // }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add EthTool</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='ethName' /><br />
                        Location <Input className="marTop10" id='ethLoc' /><br />
                        Description <Input className="marTop10" id='ethDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addEthTool())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addEthTool() {
        let self = this;
        let ethTool = document.getElementById('ethName').value
        let validEthTool = trimString(ethTool)
        if (!validEthTool) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validEthTool,
            'Location': document.getElementById('ethLoc').value,
            'Description': document.getElementById('ethDesc').value
        }
        postRequest(ADD_ETHTOOL, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "EthTool")
                self.setState({ displayModel: false, visible: false })

            }
        })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one EthTool to edit")
            return
        }
        this.setState({ displayEditModel: true })
        console.log(this.state.data[this.state.selectedRowIndexes[0]])

    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    renderEditModelDialog() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Ethtool</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='ethNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='ethLocEdit' defaultValue={edittedData.Location} /><br />
                        Description <Input className="marTop10" id='ethDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editEth())}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editEth = () => {
        let self = this
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        let params = {
            'Id': edittedData.Id,
            'Location': document.getElementById('ethLocEdit').value ? document.getElementById('ethLocEdit').value : "-",
            'Description': document.getElementById('ethDescEdit').value ? document.getElementById('ethDescEdit').value : "-"
        }
        putRequest(UPDATE_ETHTOOL, params).then(function (data) {
            console.log(data.Data)
            if (data.StatusCode == 200) {
                let existingData = self.state.data;
                existingData[self.state.selectedRowIndexes[0]] = data.Data
                self.setState({ data: existingData, displayEditModel: false, selectedRowIndexes: [] })
            }
            else {
                NotificationManager.error("Something went wrong", "Eth tool")
                self.setState({ displayEditModel: false, selectedRowIndexes: [] })

            }
        })
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">EthTool</div>
                </Media>
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media>
            </Media>
            <div style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
                <SummaryDataTable key={this.counter++} heading={this.state.ethHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
            </div>
            {this.renderUpgradeModelDialog()}
            {this.renderEditModelDialog()}
        </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.ethToolReducer.get('ethTools')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getEthTool: (url) => dispatch(getEthTool(url))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EthTool);