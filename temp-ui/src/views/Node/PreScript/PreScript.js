import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { preScriptHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_PRESCRIPTS, ADD_PRESCRIPT, UPDATE_PRESCRIPT, DELETE_PRESCRIPTS } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getPreScript, addPreScript, updatePreScript, deletePreScript, setPreScripiHeadings } from '../../../actions/preScriptAction';
import I from 'immutable'
import AceEditor from 'react-ace';

class PreScript extends Component {


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
        this.commandList = ""
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getPreScript(FETCH_ALL_PRESCRIPTS)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            preScriptHead: props.preScriptHeadings ? props.preScriptHeadings.toJS() : preScriptHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deletePreScript())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deletePreScript() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deletePreScript(DELETE_PRESCRIPTS, deleteIds).then(function (data) {
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
                NotificationManager.success("Pre-Script deleted successfully", "Pre-Script") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Pre-Script") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    getValue(e) {
        this.commandList = e
    }

    addPreScriptModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Pre-Script</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='preScriptName' /><br />
                        Command List {/* <Input type="textarea" className="marTop10" id='preScriptContent' /> */}<br />
                        <AceEditor
                            id='preScriptContent'
                            height={200}
                            width={265}
                            onLoad={this.onLoad}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            onChange={(e) => { this.getValue(e) }}
                            value={this.commandList}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                            }} /> <br />
                        Description <Input className="marTop10" id='preScriptDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addPreScript())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addPreScript() {
        let self = this;
        let preScript = document.getElementById('preScriptName').value
        let validPreScript = trimString(preScript)
        if (!validPreScript) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validPreScript,
            'Commands': this.commandList,
            'Description': document.getElementById('preScriptDesc').value
        }

        let preScriptPromise = self.props.addPreScript(ADD_PRESCRIPT, params)

        preScriptPromise.then(function (value) {
            NotificationManager.success("Pre-Script added successfully", "Pre-Script") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Pre-Script") // "error!"
        })
        console.log(self.state.selectedRowIndexes)
        self.setState({ displayModel: false, visible: false, selectedRowIndexes: [] })
        this.commandList = ''
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Pre-Script to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editPreScriptModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Pre-Script</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='preScriptNameEdit' value={edittedData.Name} /><br />
                        Command List {/* <Input type="textarea" className="marTop10" id='preScriptContentEdit' defaultValue={edittedData.Content} /> */}<br />
                        <AceEditor
                            id='preScriptContentEdit'
                            height={200}
                            width={265}
                            onLoad={this.onLoad}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            onChange={(e) => { this.getValue(e) }}
                            value={edittedData.Commands}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                            }} /><br />
                        Description <Input className="marTop10" id='preScriptDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editPreScript(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editPreScript = (preScriptId) => {
        let self = this
        let params = {
            'Id': preScriptId,
            'Commands': this.commandList,
            'Description': document.getElementById('preScriptDescEdit').value ? document.getElementById('preScriptDescEdit').value : "-"
        }

        this.props.updatePreScript(UPDATE_PRESCRIPT, params).then(function () {
            NotificationManager.success("Pre-Script updated successfully", "Pre-Script") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Pre-Script") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
        this.commandList = ''
    }

    setPreScriptHeadings = (headings) => {
        this.props.setPreScriptHeadings(I.fromJS(headings))
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">Pre-Script</div>
                </Media>
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media>
            </Media>
            <div style={{ height: '250px' }}>
                <SummaryDataTable
                    maxContainerHeight={250}
                    heading={this.state.preScriptHead}
                    data={this.state.data}
                    checkBoxClick={this.checkBoxClick}
                    constHeading={preScriptHead}
                    setHeadings={this.setPreScriptHeadings}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"preScriptTable"} />
            </div>
            {this.addPreScriptModal()}
            {this.editPreScriptModal()}
        </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.preScriptReducer.get('preScript'),
        preScriptHeadings: state.preScriptReducer.getIn(['preScriptHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPreScript: (url) => dispatch(getPreScript(url)),
        addPreScript: (url, params) => dispatch(addPreScript(url, params)),
        updatePreScript: (url, params) => dispatch(updatePreScript(url, params)),
        deletePreScript: (url, params) => dispatch(deletePreScript(url, params)),
        setPreScripiHeadings: (params) => dispatch(setPreScripiHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreScript);