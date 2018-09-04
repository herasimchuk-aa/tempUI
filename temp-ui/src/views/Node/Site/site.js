import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { siteHead } from '../../../consts';
import { trimString } from '../../../components/Utility/Utility';
import { getRequest, postRequest } from '../../../apis/RestApi';
import { FETCH_ALL_SITES, ADD_SITE, DELETE_SITES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';

class Site extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            siteHead: siteHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            visible: false
        }
    }

    componentDidMount() {
        this.retrieveSiteData()
    }

    retrieveSiteData() {
        let self = this
        getRequest(FETCH_ALL_SITES).then(function (json) {
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteSite())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteSite() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })
        postRequest(DELETE_SITES, deleteIds).then(function (data) {
            let failedIds = data.Data.Failure
            if (failedIds && failedIds.length) {
                failedIds.map((item) => {
                    self.state.data.find((site) => {
                        if (item == site.Id) {
                            NotificationManager.error(site.Name + " is in use", "Site")
                        }
                    })

                })
            }
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.retrieveSiteData();
        })
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Site</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='siteName' /><br />
                        Description <Input className="marTop10" id='siteDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addSite())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addSite() {
        let self = this;
        let site = document.getElementById('siteName').value
        let validSite = trimString(site)
        if (!validSite) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validSite,
            'Description': document.getElementById('siteDesc').value
        }
        postRequest(ADD_SITE, params).then(function (data) {
            if (data.StatusCode == 200) {
                let renderedData = self.state.data;
                if (!renderedData) {
                    renderedData = []
                }
                renderedData.push(data.Data)
                self.setState({ data: renderedData, displayModel: false, visible: false })
            }
            else {
                NotificationManager.error("Something went wrong", "Site")
                self.setState({ displayModel: false, visible: false })

            }
        })
    }



    render() {
        return (
            <div>
                <div className='marginLeft10'>
                    <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                    {this.showDeleteButton()}
                </div>
                <Row className="tableTitle">Site</Row>
                <SummaryDataTable heading={this.state.siteHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.renderUpgradeModelDialog()}
            </div>
        );
    }



}

export default Site;
