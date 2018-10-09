import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { siteHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi';
import { FETCH_ALL_SITES, ADD_SITE, UPDATE_SITE, DELETE_SITES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getSites, addSites, updateSite, deleteSite } from '../../../actions/siteAction';

class Site extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            siteHead: siteHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getSites(FETCH_ALL_SITES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : []
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

        this.props.deleteSite(DELETE_SITES, deleteIds).then(function (data) {
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
                NotificationManager.success("Site deleted successfully", "Site") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Site") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    addSiteModal() {
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
        let sitePromise = self.props.addSites(ADD_SITE, params)
        sitePromise.then(function (value) {
            NotificationManager.success("Site added successfully", "Site") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Site") // "error!"
        })
        self.setState({ displayModel: false, visible: false })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Site to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editSiteModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Site</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='siteNameEdit' value={edittedData.Name} /><br />
                        Description <Input className="marTop10" id='siteDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editSite(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editSite = (siteId) => {
        let self = this

        let params = {
            'Id': siteId,
            'Description': document.getElementById('siteDescEdit').value ? document.getElementById('siteDescEdit').value : "-"
        }

        let sitePromise = self.props.updateSite(UPDATE_SITE, params)

        sitePromise.then(function (value) {
            NotificationManager.success("Site updated successfully", "Site") // "Success!"
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
            NotificationManager.error("Something went wrong", "Site") // "error!"
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
                <Row className="tableTitle">Site</Row>
                <SummaryDataTable key={this.counter++} heading={this.state.siteHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                {this.addSiteModal()}
                {this.editSiteModal()}
            </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.siteReducer.get('sites')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSites: (url) => dispatch(getSites(url)),
        addSites: (url, params) => dispatch(addSites(url, params)),
        updateSite: (url, params) => dispatch(updateSite(url, params)),
        deleteSite: (url, params) => dispatch(deleteSite(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Site);
