import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { frrHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_FRR, ADD_FRR, UPDATE_FRR, DELETE_FRR } from '../../../apis/RestConfig';
import { postRequest } from '../../../apis/RestApi';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getFrr, addFrr, updateFrr, deleteFrrs } from '../../../actions/frrAction';

class Frr extends Component {


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
        this.props.getFrr(FETCH_ALL_FRR)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            frrHead: props.frrHeadings ? props.frrHeadings.toJS() : frrHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteFrr())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteFrr() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteFrrs(DELETE_FRR, deleteIds).then(function (data) {
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
                NotificationManager.success("FRR deleted successfully", "FRR") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "FRR") // "error!FRR
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });

    }

    onDismiss() {
        this.setState({ visible: false });
    }

    addFrrModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add FRR</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='frrName' /><br />
                        Location <Input className="marTop10" id='frrLoc' /><br />
                        Version <Input className="marTop10" id='frrVersion' /><br />
                        Description <Input className="marTop10" id='frrDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addFrr())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addFrr() {
        let self = this;
        let frr = document.getElementById('frrName').value
        let validFrr = trimString(frr)
        if (!validFrr) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validFrr,
            'Location': document.getElementById('frrLoc').value,
            'Version': document.getElementById('frrVersion').value,
            'Description': document.getElementById('frrDesc').value
        }
        let frrPromise = self.props.addFrr(ADD_FRR, params)

        frrPromise.then(function (value) {
            NotificationManager.success("Frr added successfully", "Frr") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Frr") // "error!"
        })
        self.setState({ displayModel: false, visible: false })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Frr to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editFrrModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Frr</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='frrLocEdit' defaultValue={edittedData.Location} /><br />
                        Version <Input className="marTop10" id='frrVersionEdit' defaultValue={edittedData.Version} /><br />
                        Description <Input className="marTop10" id='frrDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editFrr(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editFrr = (frrId) => {
        let self = this

        let params = {
            'Id': frrId,
            'Location': document.getElementById('frrLocEdit').value ? document.getElementById('frrLocEdit').value : "-",
            'Version': document.getElementById('frrVersionEdit').value ? document.getElementById('frrVersionEdit').value : "-",
            'Description': document.getElementById('frrDescEdit').value ? document.getElementById('frrDescEdit').value : "-"
        }

        let frrPromise = self.props.updateFrr(UPDATE_FRR, params)

        frrPromise.then(function (value) {
            NotificationManager.success("FRR updated successfully", "FRR") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "FRR") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }

    setFrrHeadings = (headings) => {
        this.props.setFrrHeadings(I.fromJS(headings))
    }

    render() {
        return (
            <div>
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">FRR</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                            {this.showDeleteButton()}
                        </div>
                    </Media>
                </Media>
                <div style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
                    <SummaryDataTable key={this.counter++} heading={this.state.frrHead} data={this.state.data} checkBoxClick={this.checkBoxClick}
                        constHeading={frrHead} setHeadings={this.setFrrHeadings} selectedRowIndexes={this.state.selectedRowIndexes} />
                </div>
                {this.addFrrModal()}
                {this.editFrrModal()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.frrReducer.get('frr'),
        frrHeadings: state.frrReducer.getIn(['frrHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getFrr: (url) => dispatch(getFrr(url)),
        addFrr: (url, params) => dispatch(addFrr(url, params)),
        updateFrr: (url, params) => dispatch(updateFrr(url, params)),
        deleteFrrs: (url, params) => dispatch(deleteFrrs(url, params)),
        setFrrHeadings: (params) => dispatch(setFrrHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Frr);
