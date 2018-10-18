import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../views.css';
import SummaryDataTable from '../Node/NodeSummary/SummaryDataTable';
import { userRoleHead } from '../../consts';
import { trimString } from '../../components/Utility/Utility';
import { FETCH_ALL_RBAC_ROLES, ADD_RBAC_ROLE, UPDATE_RBAC_ROLE, DELETE_RBAC_ROLES } from '../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux'
import { fetchUserRoles, addUserRoles, updateUserRoles, deleteUserRole, setUserRoleHeadings } from '../../actions/userRoleAction';
import I from 'immutable'
import MultiselectDropDown from '../../components/MultiselectDropdown/MultiselectDropDown';


class UserRole extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            userRoleHead: userRoleHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.fetchUserRoles(FETCH_ALL_RBAC_ROLES)
    }

    static getDerivedStateFromProps(props) {

        return {
            data: props.data ? props.data.toJS() : [],
            userRoleHead: props.headings ? props.headings.toJS() : userRoleHead,
            permissionData: props.permissionData ? props.permissionData.toJS() : []
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteUserRole())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteUserRole() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteUserRole(DELETE_RBAC_ROLES, deleteIds).then(function (data) {
            NotificationManager.success("User roles deleted successfully", "User Role") // "Success!"
        }).catch(function (e) {
            console.log(e)
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    handleChanges = (selectedOption) => {
        this.setState({ selectedPermissions: selectedOption });
    }

    addUserRoleModal() {
        console.log(this.state.permissionData)
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add User Role</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='userRoleName' /><br />
                        Permissions<MultiselectDropDown value={this.state.selectedPermissions} getSelectedData={this.handleChanges} options={this.state.permissionData}></MultiselectDropDown>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addUserRole())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false, selectedPermissions: '' })
    }

    addUserRole() {
        let self = this;
        let userRole = document.getElementById('userRoleName').value
        let validUserRolel = trimString(userRole)
        if (!validUserRolel) {
            this.setState({ visible: true })
            return;
        }

        let permissions = [];
        this.state.selectedPermissions.map((data) => permissions.push(data));

        let params = {
            'Name': validUserRolel,
            'Permissions': permissions
        }

        let userRolePromise = self.props.addUserRoles(ADD_RBAC_ROLE, params)

        userRolePromise.then(function (value) {
            NotificationManager.success("User Role updated successfully", "User Role") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "User Role") // "error!"
        })
        this.setState({ displayModel: false, selectedRowIndexes: [], selectedPermissions: '' })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one User Role to edit")
            return
        }
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        this.setState({ displayEditModel: true, selectedPermissions: edittedData.Permissions })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel, selectedPermissions: '' })
    }

    editUserRoleModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit User Role</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='userNameEdit' value={edittedData.Name} /><br />
                        Permissions<MultiselectDropDown value={this.state.selectedPermissions} getSelectedData={this.handleChanges} options={this.state.permissionData}></MultiselectDropDown>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editUserRole(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editUserRole = (userRoleId) => {
        let self = this

        let permissions = [];
        this.state.selectedPermissions.map((data) => permissions.push(data));

        let params = {
            'Id': userRoleId,
            'Name': document.getElementById('userNameEdit').value ? document.getElementById('userNameEdit').value : "-",
            'Permissions': permissions
        }

        let userRolePromise = self.props.updateUserRoles(UPDATE_RBAC_ROLE, params)

        userRolePromise.then(function (value) {
            NotificationManager.success("UserRole updated successfully", "UserRole") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "UserRole") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false, selectedPermissions: '' })
    }

    setUserRoleHeadings = (headings) => {
        this.props.setUserRoleHeadings(I.fromJS(headings))
    }

    render() {
        return (
            <div className="App">
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">User Roles</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                            {this.showDeleteButton()}
                        </div>
                    </Media>
                </Media>
                <div>
                    <SummaryDataTable
                        heading={this.state.userRoleHead}
                        constHeading={userRoleHead}
                        setHeadings={this.setUserRoleHeadings}
                        data={this.state.data}
                        checkBoxClick={this.checkBoxClick}
                        selectedRowIndexes={this.state.selectedRowIndexes}
                        tableName={"User Roles Table"} />
                </div>
                {this.addUserRoleModal()}
                {this.editUserRoleModal()}
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.userRoleReducer.getIn(['userRoles']),
        headings: state.userRoleReducer.getIn(['userRolesHeadings']),
        permissionData: state.permissionReducer.getIn(['permissions']),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserRoles: (url) => dispatch(fetchUserRoles(url)),
        addUserRoles: (url, params) => dispatch(addUserRoles(url, params)),
        updateUserRoles: (url, params) => dispatch(updateUserRoles(url, params)),
        deleteUserRole: (url, params) => dispatch(deleteUserRole(url, params)),
        setUserRoleHeadings: (headings) => dispatch(setUserRoleHeadings(headings))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRole);
