import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Media, Button, Input, Alert } from 'reactstrap'
import { getPermissions, addPermission, updatePermission, deletePermission, setPermissionHeadings } from '../../actions/permissionActions';
import DropDown from '../../components/dropdown/DropDown';
import SummaryDataTable from '../Node/NodeSummary/SummaryDataTable';
import '../views.css';
import { FETCH_ALL_PERMISSIONS, FETCH_ALL_ENTITIES, ADD_PERMISSION, UPDATE_PERMISSION, DELETE_PERMISSIONS } from '../../apis/RestConfig';
import { fetchAllEntities } from '../../actions/entityAction';
import { permissionHead } from '../../consts';
import { trimString } from '../../components/Utility/Utility';
import { NotificationManager } from 'react-notifications';

class Permission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayModel: false,
            displayEditModal: false,
            selectedEntity: '',
            showDelete: false,
            selectedRowIndexes: [],
            visible: false,
            errMsg: ''
        }
    }

    componentDidMount() {
        this.props.getPermission(FETCH_ALL_PERMISSIONS)
        this.props.fetchAllEntities(FETCH_ALL_ENTITIES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            entityData: props.entityData ? props.entityData.toJS() : [],
            permissionHead: props.permissionHead ? props.permissionHead.toJS() : permissionHead
        }
    }

    toggle() {
        this.setState({ displayModel: !this.state.displayModel })
    }

    toggleEdit() {
        this.setState({ displayEditModal: !this.state.displayEditModal })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Permission to edit")
            return
        }
        this.setState({ displayEditModal: true, selectedEntity: this.state.data[this.state.selectedRowIndexes[0]].Entity.Id })
    }

    showDeleteButton() {
        let deleteButton = [];
        if (this.state.showDelete == true) {
            deleteButton.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deletePermission())}>Delete</Button>);
            return deleteButton;
        }
        else
            return null;
    }

    getSelectedData = (data, identity) => {
        if (identity == 'Entity') {
            this.setState({ selectedEntity: data })
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

    onDismiss() {
        this.setState({ visible: false })
    }

    addPermissionModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.toggle()} size="sm" centered="true" >
                    <ModalHeader autoFocus toggle={() => this.toggle()}>Add Permission</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >{this.state.errMsg}</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='permissionName' /><br />
                        Entity<font color="red"><sup>*</sup></font> <DropDown className="marTop10" options={this.state.entityData} getSelectedData={this.getSelectedData} identity={"Entity"} default={this.state.selectedEntity} /><br />
                        Permissions<font color="red"><sup>*</sup></font> <br />
                        <input type="checkbox" className="marTop10" id={"_C"} defaultChecked={false} />Create<br />
                        <input type="checkbox" className="marTop10" id={"_R"} defaultChecked={false} />Read<br />
                        <input type="checkbox" className="marTop10" id={"_U"} defaultChecked={false} />Update<br />
                        <input type="checkbox" className="marTop10" id={"_D"} defaultChecked={false} />Delete
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addPermission())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggle())}>Cancel</Button>
                    </ModalFooter>
                </Modal>)

        }

    }


    addPermission() {
        let permission = document.getElementById('permissionName').value
        let validPermission = trimString(permission)
        if (!validPermission) {
            this.setState({ visible: true, errMsg: 'Name cannot be empty' });
            return;
        }

        if (!this.state.selectedEntity) {
            this.setState({ visible: true, errMsg: 'Entity cannot be empty' })
            return;
        }

        if (!document.getElementById('_C').checked && !document.getElementById('_R').checked && !document.getElementById('_U').checked && !document.getElementById('_D').checked) {
            this.setState({ visible: true, errMsg: 'Set atleast one permission' })
            return
        }

        let entityId = parseInt(this.state.selectedEntity)
        let params = {
            'Name': document.getElementById('permissionName').value,
            'Entity': {
                'Id': entityId,
            },
            'Operation': {
                'Create': document.getElementById('_C').checked,
                'Read': document.getElementById('_R').checked,
                'Update': document.getElementById('_U').checked,
                'Delete': document.getElementById('_D').checked
            }
        }

        let permissionPromise = this.props.addPermission(ADD_PERMISSION, params)

        permissionPromise.then(function () {
            NotificationManager.success("Permission added successfully", "Permission") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Permission") // "error!"
        })
        this.setState({ displayModel: false, selectedRowIndexes: [] })
    }

    editPermissionModal() {
        if (this.state.displayEditModal) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModal} toggle={() => this.toggleEdit()} size="sm" centered="true" >
                    <ModalHeader autoFocus toggle={() => this.toggleEdit()}>Edit Permission</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='permissionNameEdit' value={edittedData.Name} /><br />
                        Entity <DropDown className="marTop10" options={this.state.entityData} getSelectedData={this.getSelectedData} identity={"Entity"} default={this.state.selectedEntity} /><br />
                        Permissions <br />
                        <input type="checkbox" className="marTop10" id={"_CE"} defaultChecked={edittedData.Operation.Create} />Create<br />
                        <input type="checkbox" className="marTop10" id={"_RE"} defaultChecked={edittedData.Operation.Read} />Read<br />
                        <input type="checkbox" className="marTop10" id={"_UE"} defaultChecked={edittedData.Operation.Update} />Update<br />
                        <input type="checkbox" className="marTop10" id={"_DE"} defaultChecked={edittedData.Operation.Delete} />Delete
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editPermission())}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEdit())}>Cancel</Button>
                    </ModalFooter>
                </Modal>)

        }
    }

    editPermission() {
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        if (!this.state.selectedEntity) {
            this.setState({ visible: true, errMsg: 'Entity cannot be empty' })
            return;
        }

        let entityId = parseInt(this.state.selectedEntity)
        let params = {
            'Id': edittedData.Id,
            'Name': document.getElementById('permissionNameEdit').value,
            'Entity': {
                'Id': entityId,
            },
            'Operation': {
                'Id': edittedData.Operation.Id,
                'Create': document.getElementById('_CE').checked,
                'Read': document.getElementById('_RE').checked,
                'Update': document.getElementById('_UE').checked,
                'Delete': document.getElementById('_DE').checked
            }
        }

        let permissionPromise = this.props.updatePermission(UPDATE_PERMISSION, params)

        permissionPromise.then(function () {
            NotificationManager.success("Permission updated successfully", "Permission") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Permission") // "error!"
        })
        this.setState({ displayEditModal: false, selectedRowIndexes: [] })
    }

    deletePermission() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deletePermissions(DELETE_PERMISSIONS, deleteIds).then(function (data) {
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
                NotificationManager.success("Permissions deleted successfully", "Permission") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Permission") // "error!"
        })
        this.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    render() {
        return (
            <div className="App">
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">Permission</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.toggle())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                            {this.showDeleteButton()}
                        </div>
                    </Media>
                </Media>
                <SummaryDataTable
                    heading={this.state.permissionHead}
                    data={this.state.data}
                    setHeadings={(headings) => this.props.setPermissionHeadings(I.fromJS(headings))}
                    constHeading={permissionHead}
                    checkBoxClick={this.checkBoxClick}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"permissionTable"} />
                {this.addPermissionModal()}
                {this.editPermissionModal()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.permissionReducer.get('permissions'),
        entityData: state.entityReducer.get('entities'),
        permissionHead: state.permissionReducer.get('permissionHeadings')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPermission: (url) => dispatch(getPermissions(url)),
        fetchAllEntities: (url) => dispatch(fetchAllEntities(url)),
        addPermission: (url, params) => dispatch(addPermission(url, params)),
        updatePermission: (url, params) => dispatch(updatePermission(url, params)),
        deletePermissions: (url, params) => dispatch(deletePermission(url, params)),
        setPermissionHeadings: (params) => dispatch(setPermissionHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Permission);;
