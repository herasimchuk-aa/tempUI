import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Media, Button, Input } from 'reactstrap'
import { getPermissions, addPermission, updatePermission, deletePermission, setPermissionHeadings } from '../../actions/permissionActions';
import DropDown from '../../components/dropdown/DropDown';
import SummaryDataTable from '../Node/NodeSummary/SummaryDataTable';
import '../views.css';
import { FETCH_ALL_PERMISSIONS, FETCH_ALL_ENTITIES, ADD_PERMISSION } from '../../apis/RestConfig';
import { fetchAllEntities } from '../../actions/entityAction';
import { permissionHead } from '../../consts';

class Permission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayModel: false,
            displayEditModal: false,
            selectedEntity: '',
            showDelete: false,
            selectedRowIndexes: []
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

    addPermissionModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.toggle()} size="sm" centered="true" >
                    <ModalHeader autoFocus toggle={() => this.toggle()}>Add Permission</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='permissionName' /><br />
                        Entity <DropDown className="marTop10" options={this.state.entityData} getSelectedData={this.getSelectedData} identity={"Entity"} default={this.state.selectedEntity} /><br />
                        Permissions <br />
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
        let entityId = parseInt(this.state.selectedEntity)
        let entityName = ''
        this.state.entityData.find(item => {
            if (entityId == item.Id) {
                entityName = item.Name
                return
            }

        })

        let params = {
            'Name': document.getElementById('permissionName').value,
            'Entity': {
                'Id': entityId,
                // 'Name': entityName
            },
            'Operation': {
                'Create': document.getElementById('_C').checked,
                'Update': document.getElementById('_R').checked,
                'Read': document.getElementById('_U').checked,
                'Delete': document.getElementById('_D').checked
            }
        }
        this.props.addPermission(ADD_PERMISSION, params).then().catch()
        this.toggle()
    }

    editPermissionModal() {
        if (this.state.displayEditModal) {
            return (
                <Modal isOpen={this.state.displayEditModal} toggle={() => this.toggleEdit()} size="sm" centered="true" >
                    <ModalHeader autoFocus toggle={() => this.toggleEdit()}>Edit Permission</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='permissionName' /><br />
                        Entity <DropDown className="marTop10" options={this.state.entityData} getSelectedData={this.getSelectedData} identity={"Entity"} default={this.state.selectedEntity} /><br />
                        Permissions <br />
                        <input type="checkbox" className="marTop10" id={"_C"} defaultChecked={false} />Create<br />
                        <input type="checkbox" className="marTop10" id={"_R"} defaultChecked={false} />Read<br />
                        <input type="checkbox" className="marTop10" id={"_U"} defaultChecked={false} />Update<br />
                        <input type="checkbox" className="marTop10" id={"_D"} defaultChecked={false} />Delete
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editPermission())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEdit())}>Cancel</Button>
                    </ModalFooter>
                </Modal>)

        }
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
                            {/* <Button onClick={() => (this.toggleEdit())} className="custBtn animated fadeIn">Edit</Button> */}
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
