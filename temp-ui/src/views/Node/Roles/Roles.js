import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { roleHead } from '../../../consts'
import DropDown from '../../../components/dropdown/DropDown';
import { trimString } from '../../../components/Utility/Utility';
import { getRequest, postRequest } from '../../../apis/RestApi';
import { FETCH_ALL_ROLES, ADD_ROLE, DELETE_ROLES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';


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
        }
    }

    componentDidMount() {
        this.retrieveRoleData()
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
        postRequest(ADD_ROLE, params).then(function (data) {
            if (data.StatusCode == 200) {

                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                data.Data.ParentName = "-"
                if (data.Data.ParentId) {
                    self.state.data.find(function (element, index) {
                        if (data.Data.ParentId == element.Id) {
                            data.Data.ParentName = element.Name
                            return;
                        }
                    })
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, selectedRole: '', alertVisible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "Role")
                self.setState({ displayModel: false, selectedRole: '', alertVisible: false })

            }
        })
    }

    callback(instance, data) {
        let a = instance.state.data
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel, selectedRole: '', alertVisible: false })
    }

    deleteRole() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        postRequest(DELETE_ROLES, deleteIds).then(function (data) {
            let failedIds = data.Data.Failure
            if (failedIds && failedIds.length) {
                failedIds.map((item) => {
                    self.state.data.find((role) => {
                        if (item == role.Id) {
                            NotificationManager.error(role.Name + " is in use", "Role")
                        }
                    })

                })
            }
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.retrieveRoleData();
        })
    }

    render() {
        return (
            <div>
                <Row >
                    <Button className="custBtn animated fadeIn" id="add" outline color="secondary" onClick={() => (this.cancel())}>New</Button>
                    {this.showDeleteButton()}
                </Row>
                <Row className="tableTitle">Roles</Row>
                <SummaryDataTable heading={this.state.roleHead} data={this.state.data} toggleModel={this.toggleModel} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} showEditButton={true} />
                {this.renderUpgradeModelDialog()}

            </div>
        );
    }



}

export default Roles;