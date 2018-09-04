import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { isoHead } from '../../../consts';
import { trimString } from '../../../components/Utility/Utility';
import { getRequest, postRequest } from '../../../apis/RestApi'
import { FETCH_ALL_ISOS, ADD_ISO, DELETE_ISOS } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';

class BaseLinuxIso extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isoHead: isoHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            visible: false
        }
    }

    componentDidMount() {
        this.retrieveIsoData()
    }

    retrieveIsoData = () => {
        let self = this
        getRequest(FETCH_ALL_ISOS).then(function (json) {
            self.setState({ data: json.Data, selectedRowIndexes: [] })
        })
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteISO())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteISO() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        console.log(deleteIds)
        postRequest(DELETE_ISOS, deleteIds).then(function (data) {
            let failedIds = data.Data.Failure
            if (failedIds && failedIds.length) {
                failedIds.map((item) => {
                    self.state.data.find((iso) => {
                        if (item == iso.Id) {
                            NotificationManager.error(iso.Name + " is in use", "Base ISO")
                        }
                    })

                })
            }
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.retrieveIsoData();
        })
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Base Linux ISO</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='isoName' /><br />
                        Location <Input className="marTop10" id='isoLoc' /><br />
                        Description <Input className="marTop10" id='isoDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addIso())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addIso() {
        let self = this
        let iso = document.getElementById('isoName').value
        let validIso = trimString(iso)
        if (!validIso) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validIso,
            'Location': document.getElementById('isoLoc').value,
            'Description': document.getElementById('isoDesc').value
        }
        postRequest(ADD_ISO, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "Base ISO")
                self.setState({ displayModel: false, visible: false })

            }
        })
    }

    callback(instance, data) {
        let a = instance.state.data
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a, displayModel: !instance.state.displayModel, visible: false })
    }


    render() {
        return (
            <div>
                <div className='marginLeft10'>
                    <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                    {this.showDeleteButton()}
                </div>
                <Row className="tableTitle">Base Linux ISO</Row>
                <SummaryDataTable heading={this.state.isoHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.renderUpgradeModelDialog()}
            </div>
        );
    }



}

export default BaseLinuxIso;