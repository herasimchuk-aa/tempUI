import React, { Component } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { Row, Col, Button, Label, Media, Input } from 'reactstrap';
import '../views.css';

class Interfaces extends Component {
    constructor(props) {
        super(props)
        this.state = {
            node: {},
            selectedRowIndexes: [],
            displayAddInterfaceModal: false,
            displayUpdateInterfaceModel: false,
            singleInterface: {},
            speedData: [],
            fecData: [],
            mediaData: []
        }
        this.counter = 0;
    }

    static getDerivedStateFromProps(props, state) {
        return {
            node: props.data[0],
            speedData: props.speedData,
            fecData: props.fecData,
            mediaData: props.mediaData
        }
    }

    interfaceTableHeader() {
        return (
            <div className="padTop30">
                <Media>
                    <Media left>
                        <h5>Interfaces</h5>
                    </Media>
                    <Media body>
                    </Media>
                    <Media right>
                        <Button className="custBtn" outline color="secondary" onClick={() => (this.openInterfaceModal())}> New </Button>
                        <Button className="custBtn" outline color="secondary" onClick={() => (this.deleteInterface())}> Delete </Button>
                    </Media>
                </Media>
                <Row className="headerRow" style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <Col sm="1" className="head-name"></Col>
                    <Col sm="2" className="head-name">Interface Name</Col>
                    <Col sm="2" className="head-name">IP Address</Col>
                    <Col sm="3" className="head-name">Remote Node Name</Col>
                    <Col sm="2" className="head-name">Remote Interface</Col>
                    <Col sm="2" className="head-name">Edit</Col>
                </Row>
            </div>
        )
    }

    openInterfaceModal() {
        this.setState({ displayAddInterfaceModal: true })
    }

    deleteInterface = () => {
        let self = this
        let arr = []
        let interfaces = self.state.node.interfaces
        interfaces.map((interfaceItem, index) => {
            for (let i = 0; i < self.state.selectedRowIndexes.length; i++) {
                if (index == self.state.selectedRowIndexes[i]) {
                    arr.push(interfaceItem.Name)
                }
            }
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] == interfaceItem.Name) {
                    delete interfaces[index]
                }
            }

        })

        interfaces = interfaces.filter(function (n) { return n != undefined })

        //update node with interfaces
        let node = self.state.node
        node.interfaces = interfaces
        let operation = 'delete'
        self.props.update(node, operation)
        self.setState({ node: node, selectedRowIndexes: [] })
    }

    interfaceTableContent() {
        let rows = []
        let self = this
        let interfaces = self.state.node.interfaces
        if (interfaces && interfaces.length) {
            if (interfaces[0] == null) {

                return rows
            }

            interfaces.map((item, rowIndex) => {
                let row1 = 'headerRow1'
                if (rowIndex % 2 === 0) {
                    row1 = 'headerRow2'
                }
                if (rowIndex == interfaces.length - 1) {
                    row1 = row1 + ' headerRow3 '
                }

                let row = (<Row className={row1} style={{ marginLeft: '0px', marginRight: '0px' }}>
                    <Col sm="1" className="pad" ><Input key={self.counter++} style={{ cursor: 'pointer', marginLeft: '0px' }}
                        type="checkbox" onChange={() => (self.checkBoxClickInterface(rowIndex))} defaultChecked={false} /></Col>
                    <Col sm="2" className="pad">{item.Name ? item.Name : '-'}</Col>
                    <Col sm="2" className="pad">{item.Ip_address ? item.Ip_address : '-'}</Col>
                    <Col sm="3" className="pad">{item.Remote_node_name ? item.Remote_node_name : '-'}</Col>
                    <Col sm="2" className="pad">{item.Remote_interface ? item.Remote_interface : "-"}</Col>
                    <Col sm="2" className="pad" style={{ cursor: 'pointer' }}><i className="fa fa-pencil" aria-hidden="true" onClick={() => (self.getUpdatedInterface(item.Id, item.Name))}></i></Col>

                </Row>)
                rows.push(row)
            })
        }
        if (!interfaces || !interfaces.length) {
            let row = (<Row className='headerRow1' style={{ marginLeft: '0px', marginRight: '0px' }}>
                <Col sm="12" className="pad"><h5 className="text-center">Interface data not available</h5></Col>
            </Row>)
            rows.push(row)
            return rows
        }
        return rows
    }

    checkBoxClickInterface = (rowIndex) => {
        let { selectedRowIndexes } = this.state

        let arrayIndex = selectedRowIndexes.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndexes.splice(arrayIndex, 1)
        } else {
            selectedRowIndexes.push(rowIndex)
        }
    }

    getUpdatedInterface = (Id, Name) => {
        let interfaces = this.state.node.interfaces
        let singleInterface = {}

        interfaces.map((interfaceItem) => {
            if (Id > 0) {
                if (Id === interfaceItem.Id) {
                    singleInterface = interfaceItem
                }
            }
            else {
                if (Name === interfaceItem.Name) {
                    singleInterface = interfaceItem
                }
            }
        })
        this.setState({ displayUpdateInterfaceModel: true, singleInterface: singleInterface })
    }

    renderUpdateInterface() {
        if (this.state.displayUpdateInterfaceModel) {
            let data = this.state.singleInterface
            return (
                <ModalComponent cancel={() => this.closeInterfaceModal()} speedData={this.state.speedData} fecData={this.state.fecData} mediaData={this.state.mediaData} getData={this.updateInterface} actionButton={'Update'} data={data} ></ModalComponent>
            );
        }
    }

    updateInterface = (params) => {
        let interfaces = this.state.node.interfaces

        interfaces.map((interfaceItem) => {
            if (interfaceItem.Id === params.Id) {
                interfaceItem.Name = params.Name
                interfaceItem.Ip_address = params.Ip_address
                interfaceItem.Subnet = params.Subnet
                interfaceItem.Speed = parseInt(params.Speed)
                interfaceItem.FecType = params.FecType
                interfaceItem.MediaType = params.MediaType
                interfaceItem.Remote_node_name = params.Remote_node_name
                interfaceItem.Remote_interface = params.Remote_interface
                interfaceItem.Is_management_interface = params.Is_management_interface
                interfaceItem.Autoneg = params.Autoneg
            }
        })

        let node = this.state.node
        node.interfaces = interfaces

        this.props.update(node)
        this.setState({ displayUpdateInterfaceModel: false, node: node })
    }

    closeInterfaceModal = () => {
        this.setState({ displayAddInterfaceModal: false, displayUpdateInterfaceModel: false })
    }

    renderAddInterface() {
        if (this.state.displayAddInterfaceModal) {
            return (
                <ModalComponent cancel={() => this.closeInterfaceModal()} speedData={this.state.speedData} fecData={this.state.fecData} mediaData={this.state.mediaData} getData={this.addInterface} actionButton={'Add'}></ModalComponent>
            );
        }
    }

    addInterface = (params) => {
        let node = this.state.node
        let newInterface = {
            'Id': params.Id,
            'Remote_node_name': params.Remote_node_name,
            'Remote_interface': params.Remote_interface,
            'Ip_address': params.Ip_address,
            'Name': params.Name,
            'Subnet': params.Subnet,
            'Speed': parseInt(params.Speed),
            'FecType': params.FecType,
            'MediaType': params.MediaType,
            'Autoneg': params.Autoneg,
            'Is_management_interface': params.Is_management_interface,
            'Node_Id': node.Id
        }
        let interfaces = node.interfaces
        if (!interfaces || !interfaces.length) {
            interfaces = []
        }
        interfaces.push(newInterface)
        node.interfaces = interfaces
        // this.setState({ displayAddInterfaceModal: !this.state.displayAddInterfaceModal, node: node, interfaces: interfaces, saveBtn: false })
        this.setState({ displayAddInterfaceModal: !this.state.displayAddInterfaceModal, node: node })
        this.props.update(node)
        //  NotificationManager.success('Saved Successfully', 'Interface');
    }

    render() {
        let interfaceTableHeader = this.interfaceTableHeader()
        let interfaceTableContent = this.interfaceTableContent()
        return (
            <div>
                {interfaceTableHeader}
                {interfaceTableContent}
                {this.renderAddInterface()}
                {this.renderUpdateInterface()}
            </div>
        )
    }
}

export default Interfaces