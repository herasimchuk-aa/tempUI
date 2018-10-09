import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { lldpHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi'
import { FETCH_ALL_LLDP, ADD_LLDP, UPDATE_LLDP, DELETE_LLDP } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getLLDP, addLLDP, updateLLDP, deleteLLDP } from '../../../actions/lldpAction';

class LLDP extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            lldpHead: lldpHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getLLDP(FETCH_ALL_LLDP);
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : []
        }
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteLLDP())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteLLDP() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteLLDP(DELETE_LLDP, deleteIds).then(function (data) {
            if (data.Failure && data.Failure.length) {
                let nameArr = getNameById(data.Failure, self.state.data)
                let str = ""
                if (nameArr.length === 1) {
                    str += nameArr[0] + " is in use."
                } else {
                    nameArr.map(function (name) {
                        str += name + ","
                    })
                    str += " are in use."
                }
                NotificationManager.error(str)
            } else {
                NotificationManager.success("LLDP deleted successfully", "LLDP") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "LLDP") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    addLLDPModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add LLDP</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='lldpName' />
                        Location <Input className="marTop10" id='lldpLoc' />
                        Version <Input className="marTop10" id='lldpVersion' />
                        Description <Input className="marTop10" id='lldpDesc' />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addLLDP())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addLLDP() {
        let self = this;
        let lldp = document.getElementById('lldpName').value
        let validlldp = trimString(lldp)
        if (!validlldp) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validlldp,
            'Location': document.getElementById('lldpLoc').value,
            'Version': document.getElementById('lldpVersion').value,
            'Description': document.getElementById('lldpDesc').value
        }

        let lldpPromise = self.props.addLLDP(ADD_LLDP, params)

        lldpPromise.then(function (value) {
            NotificationManager.success("lldp added successfully", "lldp") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "lldp") // "error!"
        })
        self.setState({ displayModel: false, visible: false })

    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one LLDP to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editLLDPModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit LLDP</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='lldpNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='lldpLocEdit' defaultValue={edittedData.Location} /><br />
                        Version <Input className="marTop10" id='lldpVersionEdit' defaultValue={edittedData.Version} /><br />
                        Description <Input className="marTop10" id='lldpDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editLldp(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editLldp = (lldpId) => {
        let self = this
        let params = {
            'Id': lldpId,
            'Location': document.getElementById('lldpLocEdit').value ? document.getElementById('lldpLocEdit').value : "-",
            'Version': document.getElementById('lldpVersionEdit').value ? document.getElementById('lldpVersionEdit').value : "-",
            'Description': document.getElementById('lldpDescEdit').value ? document.getElementById('lldpDescEdit').value : "-"
        }

        let lldpPromise = self.props.updateLLDP(UPDATE_LLDP, params)

        lldpPromise.then(function (value) {
            NotificationManager.success("LLDP updated successfully", "LLDP") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "LLDP") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">LLDP</div>
                </Media>
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media>
            </Media>
            <div style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
                <SummaryDataTable key={this.counter++} heading={this.state.lldpHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
            </div>
            {this.addLLDPModal()}
            {this.editLLDPModal()}
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.lldpReducer.get('lldps')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLLDP: (url) => dispatch(getLLDP(url)),
        addLLDP: (url, params) => dispatch(addLLDP(url, params)),
        updateLLDP: (url, params) => dispatch(updateLLDP(url, params)),
        deleteLLDP: (url, params) => dispatch(deleteLLDP(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LLDP);
