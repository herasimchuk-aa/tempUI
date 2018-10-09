import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { isoHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_ISOS, ADD_ISO, UPDATE_ISO, DELETE_ISOS } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getISOs, addISOs, updateISO, deleteISO } from '../../../actions/baseIsoActions';

class BaseLinuxIso extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isoHead: isoHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getISOs(FETCH_ALL_ISOS)
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteISO())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteISO() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteISO(DELETE_ISOS, deleteIds).then(function (data) {
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
                NotificationManager.success("Base Iso deleted successfully", "Base Iso") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Base Iso") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    addISOModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Base Linux ISO</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='isoName' /><br />
                        Location <Input className="marTop10" id='isoLoc' /><br />
                        Description <Input className="marTop10" id='isoDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addIso())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addIso() {
        let self = this
        let iso = document.getElementById('isoName').value
        let validIso = trimString(iso)
        if (!validIso) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validIso,
            'Location': document.getElementById('isoLoc').value,
            'Description': document.getElementById('isoDesc').value
        }

        let isoPromise = self.props.addISOs(ADD_ISO, params)
        isoPromise.then(function (value) {
            NotificationManager.success("ISO added successfully", "ISO") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "ISO") // "error!"
        })
        self.setState({ displayModel: false, visible: false })

    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one ISO to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editISOModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Base Linux ISO</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='isoNameEdit' value={edittedData.Name} disabled /><br />
                        Location <Input className="marTop10" id='isoLocEdit' defaultValue={edittedData.Location} /><br />
                        Description <Input className="marTop10" id='isoDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editIso(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editIso = (isoID) => {
        let self = this
        let params = {
            'Id': isoID,
            'Location': document.getElementById('isoLocEdit').value ? document.getElementById('isoLocEdit').value : "-",
            'Description': document.getElementById('isoDescEdit').value ? document.getElementById('isoDescEdit').value : "-"
        }

        let isoPromise = self.props.updateISO(UPDATE_ISO, params)

        isoPromise.then(function (value) {
            NotificationManager.success("ISO updated successfully", "ISO") // "Success!"
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
            NotificationManager.error("Something went wrong", "ISO") // "error!"
        })
    }


    render() {
        return (
            <div>
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">Base Linux ISO</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                            {this.showDeleteButton()}
                        </div>
                    </Media>
                </Media>
                <div style={{ height: '250px', overflowY: 'scroll' }}>
                    <SummaryDataTable key={this.counter++} heading={this.state.isoHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                </div>
                {this.addISOModal()}
                {this.editISOModal()}
            </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.baseISOReducer.get('isos')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getISOs: (url) => dispatch(getISOs(url)),
        addISOs: (url, params) => dispatch(addISOs(url, params)),
        updateISO: (url, params) => dispatch(updateISO(url, params)),
        deleteISO: (url, params) => dispatch(deleteISO(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseLinuxIso)