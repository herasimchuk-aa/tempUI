import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { roleHead } from '../../../consts'
import DropDown from '../../../components/dropdown/DropDown';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi';
import { FETCH_ALL_ROLES, ADD_ROLE, UPDATE_ROLE, DELETE_ROLES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { fetchRoles, addRole, updateRole, deleteRoles, setRoleHeadings } from '../../../actions/roleAction';
import I from 'immutable'

// import $ from 'jquery';

class Roles extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            roleHead: roleHead,
            displayModel: false,
            displayEditModel: false,
            selectedRowIndexes: [],
            showDelete: false,
            alertVisible: false,
            selectedRole: '',
            displayRoleUpdateModel: false,
            updateRowIndex: null,
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.fetchRoles(FETCH_ALL_ROLES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            roleHead: props.headings ? props.headings.toJS() : roleHead
        }
    }

    retrieveRoleData() {
        let self = this
        getRequest(FETCH_ALL_ROLES).then(function (json) {
            json.Data.map(function (item, index) {
                let parentId = json.Data[index].ParentId
                json.Data[index].ParentName = '-'
                if (parentId) {
                    json.Data.find(function (element) {
                        if (parentId == element.Id) {
                            json.Data[index].ParentName = element.Name
                        }
                    })
                }
            })
            self.setState({ data: json.Data, selectedRowIndexes: [] })
        })
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
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='roleName' /><br />
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
        this.setState({ displayModel: !this.state.displayModel, alertVisible: false })
    }
    onDismiss() {
        this.setState({ alertVisible: false });
    }


    addRole() {
        let self = this;
        let rolename = document.getElementById('roleName').value
        let validRoleName = trimString(rolename)
        if (!validRoleName) {
            this.setState({ alertVisible: true });
            return;
        }
        let params = {}
        if (this.state.selectedRole) {
            params = {
                'ParentId': parseInt(this.state.selectedRole),
                'Name': validRoleName,
                'Description': document.getElementById('roleDesc').value
            }
        }
        else {
            params = {
                'Name': validRoleName,
                'Description': document.getElementById('roleDesc').value
            }
        }
        this.props.addRole(ADD_ROLE, params)
        this.setState({ displayModel: false, selectedRole: '', alertVisible: false })
    }

    deleteRole() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        this.props.deleteRoles(DELETE_ROLES, deleteIds).then(function (data) {
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
                NotificationManager.success("Role deleted successfully", "Role") // "Success!"
            }
        }).catch(function (e) {
            console.error(e)
            NotificationManager.error("Something went wrong", "Role") // "error!"
        })
        this.setState({ showDelete: false, selectedRowIndexes: [] })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Role to edit")
            return
        }
        this.setState({ displayEditModel: true, selectedRole: this.state.data[this.state.selectedRowIndexes[0]].ParentId })

    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    renderEditModelDialog() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            let roles = JSON.parse(JSON.stringify(this.state.data))
            roles.splice(this.state.data.indexOf(edittedData), 1)
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Role</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='roleNameEdit' disabled defaultValue={edittedData.Name} /><br />
                        Parent Role <DropDown className="marTop10" options={roles} getSelectedData={this.getSelectedData} identity={"Role"} default={this.state.selectedRole} /><br />
                        Description <Input className="marTop10" id='roleDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editRole(edittedData.Id))}>Save</Button>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>

                    </ModalFooter>
                </Modal>
            );
        }
    }

    editRole = (roleId) => {
        let self = this
        let params = {}
        if (this.state.selectedRole) {
            params = {
                'Id': roleId,
                'ParentId': parseInt(this.state.selectedRole),
                'Description': document.getElementById('roleDescEdit').value ? document.getElementById('roleDescEdit').value : "-"
            }
        }
        else {
            params = {
                'Id': roleId,
                'ParentId': null,
                'Description': document.getElementById('roleDescEdit').value ? document.getElementById('roleDescEdit').value : "-"
            }
        }

        let rolePromise = this.props.updateRole(UPDATE_ROLE, params)
        rolePromise.then(function () {
            NotificationManager.success("Role updated successfully", "Role")
            self.setState({ displayEditModel: false, selectedRowIndexes: [], selectedRole: '' })
        }).catch(function (e) {
            console.error(e)
            self.setState({ displayEditModel: false, selectedRowIndexes: [], selectedRole: '' })
            NotificationManager.error("Something went wrong", "Role")
        })
    }


    render() {
        return (
            <div>
                <Row >
                    <Button className="custBtn animated fadeIn" id="add" outline color="secondary" onClick={() => (this.cancel())}>New</Button>
                    <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                    {this.showDeleteButton()}
                </Row>
                <Row className="tableTitle">Roles</Row>
                <SummaryDataTable key={this.counter++} heading={this.state.roleHead} constHeading={roleHead} setHeadings={(headings) => this.props.setRoleHeadings(I.fromJS(headings))}
                    data={this.state.data} toggleModel={this.toggleModel} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} showEditButton={true} />
                {this.renderUpgradeModelDialog()}
                {this.renderEditModelDialog()}

            </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.roleReducer.get('roles'),
        headings: state.roleReducer.getIn(['roleHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchRoles: (url) => dispatch(fetchRoles(url)),
        addRole: (url, params) => dispatch(addRole(url, params)),
        updateRole: (url, params) => dispatch(updateRole(url, params)),
        deleteRoles: (url, params) => dispatch(deleteRoles(url, params)),
        setRoleHeadings: (params) => dispatch(setRoleHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Roles)