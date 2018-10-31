import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { modulesLoadHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_MODULES_LOAD, ADD_MODULES_LOAD, UPDATE_MODULES_LOAD, DELETE_MODULES_LOAD } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getModulesLoad, addModulesLoad, updateModulesLoad, deleteModulesLoad, setModulesLoadHeadings } from '../../../actions/modulesLoadAction';
import I from 'immutable'

class ModulesLoad extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getModulesLoad(FETCH_ALL_MODULES_LOAD)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            modulesLoadHead: props.modulesLoadHeadings ? props.modulesLoadHeadings.toJS() : modulesLoadHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteModulesLoad())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteModulesLoad() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteModulesLoad(DELETE_MODULES_LOAD, deleteIds).then(function (data) {
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
                NotificationManager.success("ModulesLoad deleted successfully", "ModulesLoad") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "ModulesLoad") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    addModulesLoadModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add ModulesLoad</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='modulesLoadName' /><br />
                        Location <Input className="marTop10" id='modulesLoadLoc' /><br />
                        Configuration <Input type="textarea" className="marTop10" id='modulesLoadContent' /><br />
                        Description <Input className="marTop10" id='modulesLoadDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addModulesLoad())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addModulesLoad() {
        let self = this;
        let modulesLoad = document.getElementById('modulesLoadName').value
        let validModulesLoad = trimString(modulesLoad)
        if (!validModulesLoad) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validModulesLoad,
            'Location': document.getElementById('modulesLoadLoc').value,
            'Content': document.getElementById('modulesLoadContent').value,
            'Description': document.getElementById('modulesLoadDesc').value
        }

        let modulesLoadPromise = self.props.addModulesLoad(ADD_MODULES_LOAD, params)

        modulesLoadPromise.then(function (value) {
            NotificationManager.success("ModulesLoad added successfully", "ModulesLoad") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "ModulesLoad") // "error!"
        })
        console.log(self.state.selectedRowIndexes)
        self.setState({ displayModel: false, visible: false, selectedRowIndexes: [] })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one ModulesLoad to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editModulesLoadModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Modules-Load</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='modulesLoadNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='modulesLoadLocEdit' defaultValue={edittedData.Location} /><br />
                        Configuration <Input type="textarea" className="marTop10" id='modulesLoadContentEdit' defaultValue={edittedData.Content} /><br />
                        Description <Input className="marTop10" id='modulesLoadDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editModulesLoad(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editModulesLoad = (modulesLoadId) => {
        let self = this
        let params = {
            'Id': modulesLoadId,
            'Location': document.getElementById('modulesLoadLocEdit').value ? document.getElementById('modulesLoadLocEdit').value : "-",
            'Content': document.getElementById('modulesLoadContentEdit').value ? document.getElementById('modulesLoadContentEdit').value : "-",
            'Description': document.getElementById('modulesLoadDescEdit').value ? document.getElementById('modulesLoadDescEdit').value : "-"
        }

        let modulesLoadPromise = self.props.updateModulesLoad(UPDATE_MODULES_LOAD, params)

        modulesLoadPromise.then(function (value) {
            NotificationManager.success("ModulesLoad updated successfully", "ModulesLoad") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "ModulesLoad") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }

    setModulesLoadHeadings = (headings) => {
        this.props.setModulesLoadHeadings(I.fromJS(headings))
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">ModulesLoad</div>
                </Media>
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media>
            </Media>
            <div style={{ height: '200px' }}>
                <SummaryDataTable
                    maxContainerHeight={200}
                    heading={this.state.modulesLoadHead}
                    data={this.state.data}
                    checkBoxClick={this.checkBoxClick}
                    constHeading={modulesLoadHead}
                    setHeadings={this.setModulesLoadHeadings}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"modulesLoadTable"} />
            </div>
            {this.addModulesLoadModal()}
            {this.editModulesLoadModal()}
        </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.modulesLoadReducer.get('modulesLoad'),
        modulesLoadHeadings: state.modulesLoadReducer.getIn(['modulesLoadHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getModulesLoad: (url) => dispatch(getModulesLoad(url)),
        addModulesLoad: (url, params) => dispatch(addModulesLoad(url, params)),
        updateModulesLoad: (url, params) => dispatch(updateModulesLoad(url, params)),
        deleteModulesLoad: (url, params) => dispatch(deleteModulesLoad(url, params)),
        setModulesLoadHeadings: (params) => dispatch(setModulesLoadHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModulesLoad);