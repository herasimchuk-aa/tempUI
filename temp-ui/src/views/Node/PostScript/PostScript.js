import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { postScriptHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_POSTSCRIPTS, ADD_POSTSCRIPT, UPDATE_POSTSCRIPT, DELETE_POSTSCRIPTS } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getPostScript, addPostScript, updatePostScript, deletePostScript, setPostScripiHeadings } from '../../../actions/postScriptAction';
import I from 'immutable'
import AceEditor from 'react-ace';

class PostScript extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false,
        }
        this.commandList = ""
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getPostScript(FETCH_ALL_POSTSCRIPTS)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            postScriptHead: props.postScriptHeadings ? props.postScriptHeadings.toJS() : postScriptHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deletePostScript())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deletePostScript() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deletePostScript(DELETE_POSTSCRIPTS, deleteIds).then(function (data) {
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
                NotificationManager.success("Post-Script deleted successfully", "Post-Script") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Post-Script") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    getValue(e) {
        this.commandList = e
    }

    addPostScriptModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Post-Script</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='postScriptName' /><br />
                        Command List {/* <Input type="textarea" className="marTop10" id='postScriptContent' /> */}<br />
                        <AceEditor
                            id='postScriptContent'
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
                        Description <Input className="marTop10" id='postScriptDesc' /><br />

                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addPostScript())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addPostScript() {
        let self = this;
        let postScript = document.getElementById('postScriptName').value
        let validPostScript = trimString(postScript)
        if (!validPostScript) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validPostScript,
            'Commands': this.commandList,
            'Description': document.getElementById('postScriptDesc').value
        }

        let postScriptPromise = self.props.addPostScript(ADD_POSTSCRIPT, params)

        postScriptPromise.then(function (value) {
            NotificationManager.success("Post-Script added successfully", "Post-Script") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Post-Script") // "error!"
        })
        console.log(self.state.selectedRowIndexes)
        self.setState({ displayModel: false, visible: false, selectedRowIndexes: [] })
        this.commandList = ''
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Post-Script to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editPostScriptModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Post-Script</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='postScriptNameEdit' value={edittedData.Name} /><br />
                        Command List {/* <Input type="textarea" className="marTop10" id='postScriptContentEdit' defaultValue={edittedData.Content} /><br /> */}
                        <AceEditor
                            id='postScriptContentEdit'
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
                            }} />
                        Description <Input className="marTop10" id='postScriptDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editPostScript(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editPostScript = (postScriptId) => {
        let self = this
        let params = {
            'Id': postScriptId,
            'Commands': this.commandList,
            'Description': document.getElementById('postScriptDescEdit').value ? document.getElementById('postScriptDescEdit').value : "-"
        }

        this.props.updatePostScript(UPDATE_POSTSCRIPT, params).then(function () {
            NotificationManager.success("Post-Script updated successfully", "Post-Script") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Post-Script") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
        this.commandList = ''
    }

    setPostScriptHeadings = (headings) => {
        this.props.setPostScriptHeadings(I.fromJS(headings))
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">Post-Script</div>
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
                    heading={this.state.postScriptHead}
                    data={this.state.data}
                    checkBoxClick={this.checkBoxClick}
                    constHeading={postScriptHead}
                    setHeadings={this.setPostScriptHeadings}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"postScriptTable"} />
            </div>
            {this.addPostScriptModal()}
            {this.editPostScriptModal()}
        </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.postScriptReducer.get('postScript'),
        postScriptHeadings: state.postScriptReducer.getIn(['postScriptHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPostScript: (url) => dispatch(getPostScript(url)),
        addPostScript: (url, params) => dispatch(addPostScript(url, params)),
        updatePostScript: (url, params) => dispatch(updatePostScript(url, params)),
        deletePostScript: (url, params) => dispatch(deletePostScript(url, params)),
        setPostScripiHeadings: (params) => dispatch(setPostScripiHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostScript);