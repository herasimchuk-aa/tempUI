import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { modProbeHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_MODPROBE, ADD_MODPROBE, UPDATE_MODPROBE, DELETE_MODPROBE } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getModProbe, addModProbe, updateModProbe, deleteModProbe, setModProbeHeadings } from '../../../actions/modProbeAction';
import I from 'immutable'
import AceEditor from 'react-ace';

class ModProbe extends Component {


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
        this.configurations = ""
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getModProbe(FETCH_ALL_MODPROBE)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            modProbeHead: props.modProbeHeadings ? props.modProbeHeadings.toJS() : modProbeHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteModProbe())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteModProbe() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteModProbe(DELETE_MODPROBE, deleteIds).then(function (data) {
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
                NotificationManager.success("ModProbe deleted successfully", "ModProbe") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "ModProbe") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    getValue(e) {
        this.configurations = e
    }

    addModProbeModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add ModProbe</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='modProbeName' /><br />
                        Location <Input className="marTop10" id='modProbeLoc' /><br />
                        Configuration {/* <Input type="textarea" className="marTop10" id='modProbeContent' /> */}<br />
                        <AceEditor
                            id='modProbeContent'
                            height={200}
                            width={265}
                            onLoad={this.onLoad}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            onChange={(e) => { this.getValue(e) }}
                            value={this.configurations}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                            }} /> <br />
                        Description <Input className="marTop10" id='modProbeDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addModProbe())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addModProbe() {
        let self = this;
        let modProbe = document.getElementById('modProbeName').value
        let validModProbe = trimString(modProbe)
        if (!validModProbe) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validModProbe,
            'Location': document.getElementById('modProbeLoc').value,
            'Content': this.configurations,
            'Description': document.getElementById('modProbeDesc').value
        }

        let modProbePromise = self.props.addModProbe(ADD_MODPROBE, params)

        modProbePromise.then(function (value) {
            NotificationManager.success("ModProbe added successfully", "ModProbe") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "ModProbe") // "error!"
        })
        console.log(self.state.selectedRowIndexes)
        self.setState({ displayModel: false, visible: false, selectedRowIndexes: [] })
        this.configurations = ''
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one ModProbe to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editModProbeModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit ModProbe</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='modProbeNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='modProbeLocEdit' defaultValue={edittedData.Location} /><br />
                        Configuration {/* <Input type="textarea" className="marTop10" id='modProbeContentEdit' defaultValue={edittedData.Content} /> */}<br />
                        <AceEditor
                            id='modProbeContentEdit'
                            height={200}
                            width={265}
                            onLoad={this.onLoad}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            onChange={(e) => { this.getValue(e) }}
                            value={edittedData.Content}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 2,
                            }} /><br />
                        Description <Input className="marTop10" id='modProbeDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editModProbe(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editModProbe = (modProbeId) => {
        let self = this
        let params = {
            'Id': modProbeId,
            'Location': document.getElementById('modProbeLocEdit').value ? document.getElementById('modProbeLocEdit').value : "-",
            'Content': this.configurations,
            'Description': document.getElementById('modProbeDescEdit').value ? document.getElementById('modProbeDescEdit').value : "-"
        }

        let modProbePromise = self.props.updateModProbe(UPDATE_MODPROBE, params)

        modProbePromise.then(function (value) {
            NotificationManager.success("ModProbe updated successfully", "ModProbe") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "ModProbe") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
        this.configurations = ''
    }

    setModProbeHeadings = (headings) => {
        this.props.setModProbeHeadings(I.fromJS(headings))
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">ModProbe</div>
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
                    heading={this.state.modProbeHead}
                    data={this.state.data}
                    checkBoxClick={this.checkBoxClick}
                    constHeading={modProbeHead}
                    setHeadings={this.setModProbeHeadings}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"modProbeTable"} />
            </div>
            {this.addModProbeModal()}
            {this.editModProbeModal()}
        </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.modProbeReducer.get('modProbe'),
        modProbeHeadings: state.modProbeReducer.getIn(['modProbeHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getModProbe: (url) => dispatch(getModProbe(url)),
        addModProbe: (url, params) => dispatch(addModProbe(url, params)),
        updateModProbe: (url, params) => dispatch(updateModProbe(url, params)),
        deleteModProbe: (url, params) => dispatch(deleteModProbe(url, params)),
        setModProbeHeadings: (params) => dispatch(setModProbeHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModProbe);