import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { goesHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi'
import { FETCH_ALL_GOES, ADD_GOES, UPDATE_GOES, DELETE_GOES } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getGoes } from '../../../actions/goesAction';

class Goes extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            goesHead: goesHead,
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
            data: props.data ? props.data.toJS() : []
        }
    }

    drawHeader() {
        return (<Row className="headerRow">
            <Col sm="1" className="head-name">  </Col>
            <Col sm="4" className="head-name">Name</Col>
            <Col sm="4" className="head-name">Description</Col>
            {/* <Col sm="4" className="head-name">Applicable Type</Col> */}
        </Row>)
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
        postRequest(DELETE_GOES, deleteIds).then(function (data) {
            let failedGoes = []
            failedGoes = getNameById(data.Data.Failure, self.state.data);
            failedGoes.map((item) => {
                NotificationManager.error(item + ' is in use', "Goes")
            })
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.props.getGoes(FETCH_ALL_GOES);
        })
    }


    // drawtable() {
    //     let { data } = this.state
    //     let rows = []
    //     let header = this.drawHeader()
    //     rows.push(header)
    //     if (data && data.length) {
    //         let kernel = data;
    //         kernel.map((linuxKernel, i) => {
    //             let row1 = 'headerRow2'

    //             if (i % 2 === 0) {
    //                 row1 = 'headerRow1'
    //             }
    //             if (i == kernel.length - 1) {
    //                 row1 = row1 + ' headerRow3 '
    //             }
    //             let row = (<Row className={row1}>
    //                 <Col sm="1" className="pad"><Input className="marLeft40" type="checkbox" onChange={() => (this.checkBoxClick(i))}></Input></Col>
    //                 <Col sm="4" className="pad">{linuxKernel.label}</Col>
    //                 <Col sm="4" className="pad">{linuxKernel.description}</Col>
    //                 {/* <Col sm="4" className="pad">{linuxKernel.value}</Col> */}
    //             </Row>)
    //             rows.push(row)
    //         })
    //     }
    //     return rows
    // }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Goes</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='goesName' /><br />
                        Location <Input className="marTop10" id='goesLoc' /><br />
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
            'Description': document.getElementById('goesDesc').value
        }
        postRequest(ADD_GOES, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "Goes")
                self.setState({ displayModel: false, visible: false })

            }
        })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Goes to edit")
            return
        }
        this.setState({ displayEditModel: true })
        console.log(this.state.data[this.state.selectedRowIndexes[0]])

    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    renderEditModelDialog() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Linux Kernel</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='goesNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='goesLocEdit' defaultValue={edittedData.Location} /><br />
                        Description <Input className="marTop10" id='goesDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editKernel())}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editKernel = () => {
        let self = this
        let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
        let params = {
            'Id': edittedData.Id,
            'Location': document.getElementById('goesLocEdit').value ? document.getElementById('goesLocEdit').value : "-",
            'Description': document.getElementById('goesDescEdit').value ? document.getElementById('goesDescEdit').value : "-"
        }
        putRequest(UPDATE_GOES, params).then(function (data) {
            console.log(data.Data)
            if (data.StatusCode == 200) {
                let existingData = self.state.data;
                existingData[self.state.selectedRowIndexes[0]] = data.Data
                self.setState({ data: existingData, displayEditModel: false, selectedRowIndexes: [] })
            }
            else {
                NotificationManager.error("Something went wrong", "Goes")
                self.setState({ displayEditModel: false, selectedRowIndexes: [] })

            }
        })
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
            <div style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
                <SummaryDataTable key={this.counter++} heading={this.state.goesHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
            </div>
            {this.renderUpgradeModelDialog()}
            {this.renderEditModelDialog()}
        </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.goesReducer.get('goes')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGoes: (url) => dispatch(getGoes(url))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Goes);