import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media } from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { ethHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_ETHTOOL, ADD_ETHTOOL, UPDATE_ETHTOOL, DELETE_ETHTOOL } from '../../../apis/RestConfig'
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getEthTool, addEthTool, updateEthTool, deleteEthTools, setEthtoolHeadings } from '../../../actions/ethToolAction';
import I from 'immutable'

class EthTool extends Component {


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
        this.props.getEthTool(FETCH_ALL_ETHTOOL)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            ethHead: props.ethtoolHeadings ? props.ethtoolHeadings.toJS() : ethHead
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteEth())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }

    deleteEth() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteEthTools(DELETE_ETHTOOL, deleteIds).then(function (data) {
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
                NotificationManager.success("EthTool deleted successfully", "EthTool") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "EthTool") // "error!"
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });
    }


    onDismiss() {
        this.setState({ visible: false });
    }

    addEthToolModal() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add EthTool</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='ethName' /><br />
                        Location <Input className="marTop10" id='ethLoc' /><br />
                        Version <Input className="marTop10" id='ethVersion' /><br />
                        Description <Input className="marTop10" id='ethDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addEthTool())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false })
    }

    addEthTool() {
        let self = this;
        let ethTool = document.getElementById('ethName').value
        let validEthTool = trimString(ethTool)
        if (!validEthTool) {
            this.setState({ visible: true })
            return;
        }
        let params = {
            'Name': validEthTool,
            'Location': document.getElementById('ethLoc').value,
            'Version': document.getElementById('ethVersion').value,
            'Description': document.getElementById('ethDesc').value
        }
        let ethPromise = self.props.addEthTool(ADD_ETHTOOL, params)

        ethPromise.then(function (value) {
            NotificationManager.success("EthTool added successfully", "EthTool") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "EthTool") // "error!"
        })
        self.setState({ displayModel: false, visible: false })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one EthTool to edit")
            return
        }
        this.setState({ displayEditModel: true })
        console.log(this.state.data[this.state.selectedRowIndexes[0]])

    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    editEthToolModal() {
        if (this.state.displayEditModel) {
            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]
            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Ethtool</ModalHeader>
                    <ModalBody>
                        Name<font color="red"><sup>*</sup></font> <Input autoFocus disabled className="marTop10" id='ethNameEdit' value={edittedData.Name} /><br />
                        Location <Input className="marTop10" id='ethLocEdit' defaultValue={edittedData.Location} /><br />
                        Version <Input className="marTop10" id='ethVersionEdit' defaultValue={edittedData.Version} /><br />
                        Description <Input className="marTop10" id='ethDescEdit' defaultValue={edittedData.Description} /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editEth(edittedData.Id))}>Save</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editEth = (ethId) => {
        let self = this
        let params = {
            'Id': ethId,
            'Location': document.getElementById('ethLocEdit').value ? document.getElementById('ethLocEdit').value : "-",
            'Version': document.getElementById('ethVersionEdit').value ? document.getElementById('ethVersionEdit').value : "-",
            'Description': document.getElementById('ethDescEdit').value ? document.getElementById('ethDescEdit').value : "-"
        }

        let ethPromise = self.props.updateEthTool(UPDATE_ETHTOOL, params)

        ethPromise.then(function (value) {
            NotificationManager.success("EthTool updated successfully", "EthTool") // "Success!"

        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "EthTool") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }

    setEthtoolHeadings = (headings) => {
        this.props.setEthtoolHeadings(I.fromJS(headings))
    }


    render() {
        return (<div>
            <Media className="tableTitle">
                <Media body>
                    <div className="padTop5">Ethtool</div>
                </Media>
                <Media right>
                    <div className='marginLeft10'>
                        <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                        <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        {this.showDeleteButton()}
                    </div>
                </Media>
            </Media>
            <div style={{ height: '200px' }}>
                <SummaryDataTable
                    maxContainerHeight={200}
                    heading={this.state.ethHead}
                    data={this.state.data}
                    checkBoxClick={this.checkBoxClick}
                    constHeading={ethHead}
                    setHeadings={this.setEthtoolHeadings}
                    selectedRowIndexes={this.state.selectedRowIndexes}
                    tableName={"ethtoolTable"} />
            </div>
            {this.addEthToolModal()}
            {this.editEthToolModal()}
        </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        data: state.ethToolReducer.get('ethTools'),
        ethtoolHeadings: state.ethToolReducer.getIn(['ethToolHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getEthTool: (url) => dispatch(getEthTool(url)),
        addEthTool: (url, params) => dispatch(addEthTool(url, params)),
        updateEthTool: (url, params) => dispatch(updateEthTool(url, params)),
        deleteEthTools: (url, params) => dispatch(deleteEthTools(url, params)),
        setEthtoolHeadings: (params) => dispatch(setEthtoolHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EthTool);