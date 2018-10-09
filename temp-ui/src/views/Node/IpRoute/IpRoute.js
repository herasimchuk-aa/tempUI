import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { ipRouteHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { getRequest, postRequest, putRequest } from '../../../apis/RestApi';
import { FETCH_ALL_IPROUTE, ADD_IPROUTE, UPDATE_IPROUTE, DELETE_IPROUTE } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getIpRoute, addIpRoutes, updateIpRoute, deleteIpRoute } from '../../../actions/ipRouteAction';

class IpRoute extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            ipRouteHead: ipRouteHead,
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getIpRoute(FETCH_ALL_IPROUTE)
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteIpRoute())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteIpRoute() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteIpRoute(DELETE_IPROUTE, deleteIds).then(function (data) {
            let failedIpRoute = []
            failedIpRoute = getNameById(data.Data.Failure, self.state.data);
            failedIpRoute.map((item) => {
                NotificationManager.error(item + ' is in use', "IpRoute")
            })
            NotificationManager.error('IpRoute deleted successfully', "IpRoute")
            self.setState({ showDelete: false, selectedRowIndexes: [] });
            self.props.getFrr(FETCH_ALL_IPROUTE);
        }).catch(function (e) {
            console.log(e)
        })
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add IpRoute</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='ipRouteName' /><br />
                        Location <Input className="marTop10" id='ipRouteLoc' /><br />
                        Version <Input className="marTop10" id='ipRouteVersion' /><br />
                        Description <Input className="marTop10" id='ipRouteDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addIpRoute())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addIpRoute() {
        let self = this;
        let ipRoute = document.getElementById('ipRouteName').value
        let validIpRoute = trimString(ipRoute)
        if (!validIpRoute) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validIpRoute,
            'Location': document.getElementById('ipRouteLoc').value,
            'Version': document.getElementById('ipRouteVersion').value,
            'Description': document.getElementById('ipRouteDesc').value
        }
        let itPromise = self.props.addIpRoutes(ADD_IPROUTE, params)

        itPromise.then(function (value) {
            NotificationManager.success("IpRoute added successfully", "IpRoute") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "IpRoute") // "error!"
        })
        self.setState({ displayModel: false, visible: false })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one IpRoute to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    renderEditModelDialog() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Ip Route</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='ippLocEdit' defaultValue={edittedData.Location} /><br />
                        Version <Input className="marTop10" id='ippVersionEdit' defaultValue={edittedData.Version} /><br />
                        Description <Input className="marTop10" id='ipDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editIpRoute(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editIpRoute = (ipRouteId) => {
        let self = this

        let params = {
            'Id': ipRouteId,
            'Location': document.getElementById('ippLocEdit').value ? document.getElementById('ippLocEdit').value : "-",
            'Version': document.getElementById('ippVersionEdit').value ? document.getElementById('ippVersionEdit').value : "-",
            'Description': document.getElementById('ipDescEdit').value ? document.getElementById('ipDescEdit').value : "-"
        }

        let ipRoutePromise = self.props.updateIpRoute(UPDATE_IPROUTE, params)

        ipRoutePromise.then(function (value) {
            NotificationManager.success("IpRoute updated successfully", "IpRoute") // "Success!"
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
            NotificationManager.error("Something went wrong", "IpRoute") // "error!"
        })
    }



    render() {
        return (
            <div>
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">IpRoute</div>
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
                    <SummaryDataTable key={this.counter++} heading={this.state.ipRouteHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />
                </div>
                {this.renderUpgradeModelDialog()}
                {this.renderEditModelDialog()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.ipRouteReducer.get('ipRoutes')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getIpRoute: (url) => dispatch(getIpRoute(url)),
        addIpRoutes: (url, params) => dispatch(addIpRoutes(url, params)),
        updateIpRoute: (url, params) => dispatch(updateIpRoute(url, params)),
        deleteIpRoute: (url, params) => dispatch(deleteIpRoute(url, params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IpRoute);
