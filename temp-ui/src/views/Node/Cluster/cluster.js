import React, { Component } from 'react';
import { Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { clusterHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import I from 'immutable'
import { FETCH_ALL_CLUSTERS, ADD_CLUSTER, UPDATE_CLUSTER, DELETE_CLUSTERS, FETCH_ALL_SITES } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getClusters, addClusters, updateCluster, deleteCluster, setClusterHeadings } from '../../../actions/clusterAction';
import DropDown from '../../../components/dropdown/DropDown';
import { getSites } from '../../../actions/siteAction';

class Cluster extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            clusterHead: clusterHead,
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
        this.props.getClusters(FETCH_ALL_CLUSTERS)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            siteData: props.siteData ? props.siteData.toJS() : [],
            clusterHead: props.clusterHead ? props.clusterHead.toJS() : clusterHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteCluster())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteCluster() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteCluster(DELETE_CLUSTERS, deleteIds).then(function (data) {
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
                NotificationManager.success("Cluster deleted successfully", "Cluster") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "Cluster") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }

    onDismiss() {
        this.setState({ visible: false, errorMsg: "" });
    }

    addClusterModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Cluster</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >{this.state.errorMsg}</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='clusterName' /><br />
                        Site <DropDown className="marTop10" options={this.state.siteData} getSelectedData={this.getSelectedData} identity={"Site"} /><br />
                        Description <Input className="marTop10" id='clusterDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addCluster())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false, errorMsg: "" })
    }

    getSelectedData = (data, identity) => {
        if (identity == 'Site') {
            this.setState({ selectedSite: data })
        }
    }


    addCluster() {
        let self = this;
        let cluster = document.getElementById('clusterName').value
        let validCluster = trimString(cluster)
        if (!validCluster) {
            this.setState({ visible: true, errorMsg: "Name can not be empty" });
            return;
        }
        let { siteData, selectedSite } = this.state
        let site = {}
        if (siteData && siteData.length) {
            for (let i in siteData) {
                let item = siteData[i]
                if (item.Id == selectedSite) {
                    site = item
                    break
                }
            }
        }
        if (!Object.keys(site).length) {
            this.setState({ visible: true, errorMsg: "Site can not be empty" });
            return;
        }
        let params = {
            'Name': validCluster,
            "Site": site,
            'Description': document.getElementById('clusterDesc').value
        }
        let clusterPromise = self.props.addClusters(ADD_CLUSTER, params)
        clusterPromise.then(function (value) {
            NotificationManager.success("Cluster added successfully", "Cluster") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "Cluster") // "error!"
        })
        self.setState({ displayModel: false, visible: false, errorMsg: "" })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one Cluster to edit")
            return
        }
        this.setState({ displayEditModel: true, selectedSite: this.state.data[this.state.selectedRowIndexes[0]].Site.Id })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editClusterModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Cluster</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='clusterNameEdit' value={edittedData.Name} /><br />
                        Site <DropDown className="marTop10" options={this.state.siteData} getSelectedData={this.getSelectedData} identity={"Site"} default={this.state.selectedSite} /><br />
                        Description <Input className="marTop10" id='clusterDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editCluster(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editCluster = (clusterId) => {
        let self = this

        let params = {
            'Id': clusterId,
            'Description': document.getElementById('clusterDescEdit').value ? document.getElementById('clusterDescEdit').value : "-"
        }

        let clusterPromise = self.props.updateCluster(UPDATE_CLUSTER, params)

        clusterPromise.then(function (value) {
            NotificationManager.success("Cluster updated successfully", "Cluster") // "Success!"
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
        }).catch(function (e) {
            console.warn(e)
            self.setState({ displayEditModel: false, selectedRowIndexes: [] })
            NotificationManager.error("Something went wrong", "Cluster") // "error!"
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
                <Row className="tableTitle">Cluster</Row>
                <SummaryDataTable
                    heading={this.state.clusterHead}
                    data={this.state.data}
                    setHeadings={(headings) => this.props.setClusterHeadings(I.fromJS(headings))}
                    constHeading={clusterHead}
                    checkBoxClick={this.checkBoxClick}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"clusterTable"} />
                {this.addClusterModal()}
                {this.editClusterModal()}
            </div>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.clusterReducer.get('clusters'),
        siteData: state.siteReducer.get('sites'),
        clusterHead: state.clusterReducer.get('clusterHeadings')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSites: (url) => dispatch(getSites(url)),
        getClusters: (url) => dispatch(getClusters(url)),
        addClusters: (url, params) => dispatch(addClusters(url, params)),
        updateCluster: (url, params) => dispatch(updateCluster(url, params)),
        deleteCluster: (url, params) => dispatch(deleteCluster(url, params)),
        setClusterHeadings: (params) => dispatch(setClusterHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cluster);
