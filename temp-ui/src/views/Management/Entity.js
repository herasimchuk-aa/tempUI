import React, { Component } from 'react';
import { Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../views.css';
import SummaryDataTable from '../Node/NodeSummary/SummaryDataTable';
import { entityHead } from '../../consts';
import { trimString, getNameById } from '../../components/Utility/Utility';
import I from 'immutable'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { setEntityHeadings, addEntity, fetchAllEntities, updateEntity, deleteEntity } from '../../actions/entityAction';
import { ADD_ENTITY, FETCH_ALL_ENTITIES, UPDATE_ENTITY, DELETE_ENTITIES } from '../../apis/RestConfig';

class Entity extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            entityHead: entityHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.fetchAllEntities(FETCH_ALL_ENTITIES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            entityHead: props.entityHead ? props.entityHead.toJS() : entityHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteEntity())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteEntity() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteEntity(DELETE_ENTITIES, deleteIds).then(function (data) {
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
                NotificationManager.success("Entity deleted successfully", "Entity") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Entity") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    addEntityModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Entity</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='entityName' /><br />
                        Description <Input className="marTop10" id='entityDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addEntity())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addEntity() {
        let self = this;
        let entity = document.getElementById('entityName').value
        let validEntity = trimString(entity)
        if (!validEntity) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validEntity,
            'Description': document.getElementById('entityDesc').value
        }
        let entityPromise = self.props.addEntity(ADD_ENTITY, params)
        entityPromise.then(function (value) {
            NotificationManager.success("Entity added successfully", "Entity") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Entity") // "error!"
        })
        self.setState({ displayModel: false, visible: false })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Entity to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editEntityModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Entity</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='entityNameEdit' value={edittedData.Name} /><br />
                        Description <Input className="marTop10" id='entityDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editEntity(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editEntity = (entityId) => {
        let self = this

        let params = {
            'Id': entityId,
            'Description': document.getElementById('entityDescEdit').value ? document.getElementById('entityDescEdit').value : "-"
        }

        let entityPromise = self.props.updateEntity(UPDATE_ENTITY, params)

        entityPromise.then(function (value) {
            NotificationManager.success("Entity updated successfully", "Entity") // "Success!"
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
            NotificationManager.error("Something went wrong", "Entity") // "error!"
        })
    }



    render() {
        return (
            <div>
                <div className='marginLeft10'>
                    <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                    <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                    {this.showDeleteButton()}
                </div>
                <Row className="tableTitle">Entity</Row>
                <SummaryDataTable
                    heading={this.state.entityHead}
                    data={this.state.data}
                    setHeadings={(headings) => this.props.setEntityHeadings(I.fromJS(headings))}
                    constHeading={entityHead}
                    checkBoxClick={this.checkBoxClick}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"entityTable"} />
                {this.addEntityModal()}
                {this.editEntityModal()}
            </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.entityReducer.get('entities'),
        entityHead: state.entityReducer.get('entityHeadings')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllEntities: (url) => dispatch(fetchAllEntities(url)),
        addEntity: (url, params) => dispatch(addEntity(url, params)),
        updateEntity: (url, params) => dispatch(updateEntity(url, params)),
        deleteEntity: (url, params) => dispatch(deleteEntity(url, params)),
        setEntityHeadings: (params) => dispatch(setEntityHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
