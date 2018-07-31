import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { roleHead } from '../../../consts'
import DropDown from '../../../components/dropdown/DropDown';
// import $ from 'jquery';

class Roles extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            roleHead: roleHead,
            displayModel: false,
            selectedRowIndexes: [],
            showDelete: false,
            alertVisible: false,
            selectedRole: '',
            displayRoleUpdateModel: false,
            updateRowIndex: null,
            selectedParentRole: null,
            currentRole:null
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveData, this);
    }

    retrieveData(instance, data) {
        if (data === undefined) {
            alert("No data received");
        }
        else {
            instance.setState({ data: data, selectedRowIndexes: [] });
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


    toggleModel = (rowIndex) => {
        this.setState({ updateRowIndex: rowIndex, displayRoleUpdateModel: !this.state.displayRoleUpdateModel })
    }


    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteRole())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    getSelectedData = (data, identity) => {
        if (identity == 'Role') {
            this.setState({ selectedRole: data })
        }
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Role</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.alertVisible} toggle={() => this.onDismiss()} >Role Name cannot be empty</Alert>
                        Parent Role <DropDown className="marTop10" options={this.state.data} getSelectedData={this.getSelectedData} identity={"Role"} /><br />
                        Name <Input autoFocus className="marTop10" id='roleName' /><br />
                        Description <Input className="marTop10" id='roleDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addRole())}>Add</Button>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>

                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel })
    }
    onDismiss() {
        this.setState({ alertVisible: false });
    }


    addRole() {
        if (!document.getElementById('roleName').value) {
            this.setState({ alertVisible: true });
            return;
        }
        let a = {
            'Parent': this.state.selectedRole,
            'Name': document.getElementById('roleName').value,
            'Description': document.getElementById('roleDesc').value
        }
        ServerAPI.DefaultServer().addRole(this.callback, this, a);
    }

    callback(instance, data) {
        let a = instance.state.data
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel, selectedRole: '' })
    }

    deleteRole() {
        for (let i = 0; i < this.state.selectedRowIndexes.length; i++) {
            ServerAPI.DefaultServer().deleteRole(this.callbackDelete, this, this.state.data[this.state.selectedRowIndexes[i]].label);
        }
        this.setState({ showDelete: !this.state.showDelete, selectedRowIndexes: [] });
    }

    callbackDelete = (instance) => {
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveData, this);
    }

    render() {
        return (
            <div>
                <Row >
                    <Button className="custBtn animated fadeIn" id="add" outline color="secondary" onClick={() => (this.cancel())}>New</Button>
                    {this.showDeleteButton()}
                </Row>
                <Row className="tableTitle">Roles</Row>
                <SummaryDataTable heading={this.state.roleHead} data={this.state.data} toggleModel={this.toggleModel} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} showEditButton={true}/>
                {this.renderUpgradeModelDialog()}
               
            </div>
        );
    }



}

export default Roles;