import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { kernelHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi'
import { FETCH_ALL_KERNELS, ADD_KERNEL, UPDATE_KERNEL, DELETE_KERNELS } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux'
import { fetchKernels, addKernels, updateKernel, deleteKernel } from '../../../actions/kernelAction';

class LinuxKernel extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            kernelHead: kernelHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.fetchKernels(FETCH_ALL_KERNELS)
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteKernel())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteKernel() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteKernel(DELETE_KERNELS, deleteIds).then(function (data) {
            self.props.getISOs(FETCH_ALL_KERNELS);
        }).catch(function (e) {
            console.log(e)
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    addKernelModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Linux Kernel</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='kernelName' /><br />
                        Location <Input className="marTop10" id='kernelLoc' /><br />
                        Description <Input className="marTop10" id='kernelDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addKernel())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addKernel() {
        let self = this;
        let kernel = document.getElementById('kernelName').value
        let validKernel = trimString(kernel)
        if (!validKernel) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validKernel,
            'Location': document.getElementById('kernelLoc').value,
            'Description': document.getElementById('kernelDesc').value
        }

        let kernelPromise = self.props.addKernels(ADD_KERNEL, params)

        kernelPromise.then(function (value) {
            NotificationManager.success("Kernel updated successfully", "Kernel") // "Success!"
            self.setState({ displayModel: false, selectedRowIndexes: [] })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayModel: false })
            NotificationManager.error("Something went wrong", "Kernel") // "error!"
        })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Kernel to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editKernelModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Linux Kernel</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='kernelNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='kernelLocEdit' defaultValue={edittedData.Location} /><br />
                        Description <Input className="marTop10" id='kernelDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editKernel(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editKernel = (kernelId) => {
        let self = this
        let params = {
            'Id': kernelId,
            'Location': document.getElementById('kernelLocEdit').value ? document.getElementById('kernelLocEdit').value : "-",
            'Description': document.getElementById('kernelDescEdit').value ? document.getElementById('kernelDescEdit').value : "-"
        }

        let kernelPromise = self.props.updateKernel(UPDATE_KERNEL, params)

        kernelPromise.then(function (value) {
            NotificationManager.success("Kernel updated successfully", "Kernel") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Kernel") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }


    render() {
        return (<div>

            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">Linux Kernel</div>
                </Media>
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media>
            </Media>
            <div style={{ height: '250px', overflowY: 'scroll', marginBottom: '20px' }}>
                <SummaryDataTable key={this.counter++} heading={this.state.kernelHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
            </div>
            {this.addKernelModal()}
            {this.editKernelModal()}
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.kernelReducer.getIn(['kernels'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchKernels: (url) => dispatch(fetchKernels(url)),
        addKernels: (url, params) => dispatch(addKernels(url, params)),
        updateKernel: (url, params) => dispatch(updateKernel(url, params)),
        deleteKernel: (url, params) => dispatch(deleteKernel(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinuxKernel);