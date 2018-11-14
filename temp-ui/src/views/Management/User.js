import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../views.css';
import SummaryDataTable from '../Node/NodeSummary/SummaryDataTable';
import { userHead } from '../../consts';
import { trimString,getUrlBase } from '../../components/Utility/Utility';
import { FETCH_ALL_USERS, ADD_USER, UPDATE_USER, DELETE_USERS } from '../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux'
import { fetchUsers, addUsers, updateUsers, deleteUser, setUserHeadings } from '../../actions/userAction';
import { putRequest } from '../../apis/RestApiV2';
import I from 'immutable'
import Select from 'react-select';

const usernameParam =  "rbacUserName";
const firstNameParam =  "firstName";
const lastNameParam =  "lastName";
const emailParam =  "userMail";

class User extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            userHead: userHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.fetchUsers(FETCH_ALL_USERS)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            userHead: props.headings ? props.headings.toJS() : userHead,
            userRoleData: props.userRoleData ? props.userRoleData.toJS() : []
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

    getRoles = () => {
        var roles = []
        var rolesLength = this.state.userRoleData.length;
        for (var i = 0; i < rolesLength; i++) {
            var role = this.state.userRoleData[i]
            roles.push({ value: role.name, label: role.name })
        }
        return roles;
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedUserRole: selectedOption });
    }

    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteUser())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteUser() {
        let self = this;
        let deleteUsernames = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteUsernames.push(self.state.data[item].username)
        });

        var deleteUsernamesLength = deleteUsernames.length;
        for (var i = 0; i < deleteUsernamesLength; i++) {
            var username = deleteUsernames[i];

            var delRequest = {
                "username": username
            };

            this.props.deleteUser(DELETE_USERS, delRequest).then(function (data) {
                NotificationManager.success("User "+username+" deleted successfully", "User");
            }).catch(function (e) {
                NotificationManager.error("Something went wrong on deleting "+username+" user", "User");
            })
        }

        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    addUserModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add User </ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        First Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id={firstNameParam} /><br />
                        Last Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id={lastNameParam} /><br />
                        User Name<font color="red"><sup>*</sup></font> <Input className="marTop10" id={usernameParam} /><br />
                        Email<font color="red"><sup>*</sup></font> <Input className="marTop10" id={emailParam} /><br />
                        Role<Select
                        value={this.state.selectedUserRole}
                        onChange={this.handleChange}
                        options={this.getRoles()}
                        placeholder="Specify a role"
                        isSearchable="true"
                    />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addUser())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false, selectedUserRole: '' })
    }

    addUser() {
        let self = this;
        let firstName = document.getElementById(firstNameParam).value
        let lastName = document.getElementById(lastNameParam).value
        let validFirstName = trimString(firstName)
        if (!validFirstName) {
            this.setState({ visible: true })
            return;
        }
        let validLastName = trimString(lastName)
        if (!validLastName) {
            this.setState({ visible: true })
            return;
        }
        let username = document.getElementById(usernameParam).value;
        if (!username) {
            alert("Username is mandatory")
            return
        }
        let email = document.getElementById(emailParam).value;
        if (!email) {
            alert("Email ID is mandatory")
            return
        }

        let role = this.state.selectedUserRole
        if (!role) {
            alert("Role is required")
            return
        }

        let usedUrl = getUrlBase(window.location.href)

        let params = {
            'firstname': firstName,
            'lastname': lastName,
            'username': username,
            'email': email,
            'role': role.value,
            "source": usedUrl+"/setPass",
        }

        let userPromise = self.props.addUsers(ADD_USER, params)

        userPromise.then(function (value) {
            self.props.fetchUsers(FETCH_ALL_USERS)
        })

        userPromise.then(function (value) {
            NotificationManager.success("User added successfully", "User")
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "User")
        })
        this.setState({ displayModel: false, selectedRowIndexes: [], selectedUserRole: '' })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one User Role to edit")
            return
        }
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        this.setState({ displayEditModel: true, selectedUserRole: edittedData.UserRoles })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel, selectedUserRole: '' })
    }

    editUserModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit User</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='userEdit' value={edittedData.Name} /><br />
                        User Name<font color="red"><sup>*</sup></font> <Input className="marTop10" id='rbacUserNameEdit' defaultValue={edittedData.Username} /><br />
                        Email ID<font color="red"><sup>*</sup></font> <Input className="marTop10" id='userEmailIdEdit' defaultValue={edittedData.Email} /><br />
                        User Roles<MultiselectDropDown value={this.state.selectedUserRole} getSelectedData={this.handleChanges} options={this.state.userRoleData}></MultiselectDropDown>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button className="custBtn" outline color="primary" onClick={() => (this.sendPasswordResetLink(edittedData.Email))}>Resend Link</Button>{'  '} */}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editUser(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    sendPasswordResetLink(email) {
        let params = {
            'Email': email
        }
        putRequest("/rbac/user/forgotpasswd", params).then(response => {
          if(response.statusCode==200){
              NotificationManager.success("Password reset link sent", "User")
          }else{
              NotificationManager.error("Something went wrong on reset password procedure", "User")
          }
        })
    }

    editUser = (userId) => {
        let self = this

        let userRoles = [];
        if (this.state.selectedUserRole && this.state.selectedUserRole.length)
            this.state.selectedUserRole.map((data) => userRoles.push(data));

        let params = {
            'Id': userId,
            'Name': document.getElementById('userEdit').value ? document.getElementById('userEdit').value : "-",
            'Email': document.getElementById('userEmailIdEdit').value,
            'Username': document.getElementById('rbacUserNameEdit').value,
            'UserRoles': userRoles
        }

        let userPromise = self.props.updateUsers(UPDATE_USER, params)

        userPromise.then(function (value) {
            NotificationManager.success("User updated successfully", "User") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "User") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false, selectedUserRole: '' })
    }

    setUserRoleHeadings = (headings) => {
        this.props.setUserRoleHeadings(I.fromJS(headings))
    }

    render() {
        return (
            <div className="App">
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">Users</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                            {this.showDeleteButton()}
                        </div>
                    </Media>
                </Media>
                <div >
                    <SummaryDataTable
                        heading={this.state.userHead}
                        constHeading={userHead}
                        setHeadings={this.setUserRoleHeadings}
                        data={this.state.data}
                        checkBoxClick={this.checkBoxClick}
                        selectedRowIndexes={this.state.selectedRowIndexes}
                        tableName={"Users"}/>
                </div>
                {this.addUserModal()}
                {this.editUserModal()}
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.userReducer.getIn(['users']),
        headings: state.userReducer.getIn(['userHeadings']),
        userRoleData: state.userRoleReducer.getIn(['userRoles']),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUsers: (url) => dispatch(fetchUsers(url)),
        addUsers: (url, params) => dispatch(addUsers(url, params)),
        updateUsers: (url, params) => dispatch(updateUsers(url, params)),
        deleteUser: (url, params) => dispatch(deleteUser(url, params)),
        setUserHeadings: (headings) => dispatch(setUserHeadings(headings))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
