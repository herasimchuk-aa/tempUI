import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { goesHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_GOES, ADD_GOES, UPDATE_GOES, DELETE_GOES } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getGoes, addGoes, updateGoes, deleteGoes, setGoesHeadings } from '../../../actions/goesAction';
import I from 'immutable'

class Goes extends Component {


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
        this.props.getGoes(FETCH_ALL_GOES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            goesHead: props.goesHeadings ? props.goesHeadings.toJS() : goesHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteGoes())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteGoes() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteGoes(DELETE_GOES, deleteIds).then(function (data) {
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
                NotificationManager.success("Goes deleted successfully", "Goes") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Goes") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    addGoesModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Goes</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='goesName' /><br />
                        Location <Input className="marTop10" id='goesLoc' /><br />
                        Version <Input className="marTop10" id='goesVersion' /><br />
                        Description <Input className="marTop10" id='goesDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addGoes())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addGoes() {
        let self = this;
        let goes = document.getElementById('goesName').value
        let validGoes = trimString(goes)
        if (!validGoes) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validGoes,
            'Location': document.getElementById('goesLoc').value,
            'Version': document.getElementById('goesVersion').value,
            'Description': document.getElementById('goesDesc').value
        }

        let goesPromise = self.props.addGoes(ADD_GOES, params)

        goesPromise.then(function (value) {
            NotificationManager.success("Goes added successfully", "Goes") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Goes") // "error!"
        })
        console.log(self.state.selectedRowIndexes)
        self.setState({ displayModel: false, visible: false, selectedRowIndexes: [] })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Goes to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editGoesModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Linux Kernel</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='goesNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='goesLocEdit' defaultValue={edittedData.Location} /><br />
                        Version <Input className="marTop10" id='goesVersionEdit' defaultValue={edittedData.Version} /><br />
                        Description <Input className="marTop10" id='goesDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editGoes(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editGoes = (goesId) => {
        let self = this
        let params = {
            'Id': goesId,
            'Location': document.getElementById('goesLocEdit').value ? document.getElementById('goesLocEdit').value : "-",
            'Version': document.getElementById('goesVersionEdit').value ? document.getElementById('goesVersionEdit').value : "-",
            'Description': document.getElementById('goesDescEdit').value ? document.getElementById('goesDescEdit').value : "-"
        }

        let goesPromise = self.props.updateGoes(UPDATE_GOES, params)

        goesPromise.then(function (value) {
            NotificationManager.success("Goes updated successfully", "Goes") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Goes") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }

    setGoesHeadings = (headings) => {
        this.props.setGoesHeadings(I.fromJS(headings))
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">Goes</div>
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
                    heading={this.state.goesHead}
                    data={this.state.data}
                    checkBoxClick={this.checkBoxClick}
                    constHeading={goesHead}
                    setHeadings={this.setGoesHeadings}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"goesTable"} />
            </div>
            {this.addGoesModal()}
            {this.editGoesModal()}
        </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.goesReducer.get('goes'),
        goesHeadings: state.goesReducer.getIn(['goesHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGoes: (url) => dispatch(getGoes(url)),
        addGoes: (url, params) => dispatch(addGoes(url, params)),
        updateGoes: (url, params) => dispatch(updateGoes(url, params)),
        deleteGoes: (url, params) => dispatch(deleteGoes(url, params)),
        setGoesHeadings: (params) => dispatch(setGoesHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Goes);