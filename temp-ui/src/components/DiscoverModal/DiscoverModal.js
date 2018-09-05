import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, ListGroup, ListGroupItem, UncontrolledCollapse, CardBody, Card, Alert } from 'reactstrap';
import '../../views/views.css';

class DiscoverModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: true,
            showAlert: true,
            existingNode: [],
            blankChkCount: 0,
            actualNode: {},
            totalInterfaces: []
        }
    }

    static getDerivedStateFromProps(props, state) {
        return { existingNode: props.node, actualNode: props.actualNode }
    }

    cancel = () => {
        this.setState({ isOpen: false })
        this.props.cancel()
    }

    action(node) {
        let allChecked = document.getElementById('all').checked
        let checkboxes = document.querySelectorAll('#form1 input[type="checkbox"]')
        let interfaceCheckboxes = document.querySelectorAll('#interfaceList input[type="checkbox"]')
        let actNode = node
        let existingNode = this.state.existingNode[0]
        let updatedNode = existingNode
        let blankChkCount = 0
        if (allChecked) {
            let interfaces = actNode.interfaces
            let existingInterfaces = updatedNode.interfaces
            if (interfaces && interfaces.length) {
                interfaces = interfaces.map(function (item, index) {
                    item.Name = actNode.interfaces[index].Name
                    item.Ip_address = actNode.interfaces[index].Ip_address
                    item.Admin_state = actNode.interfaces[index].Admin_state
                    item.Remote_node_name = actNode.interfaces[index].Remote_node_name
                    item.Remote_interface = actNode.interfaces[index].Remote_interface
                    item.Is_management_interface = actNode.interfaces[index].Is_management_interface
                    return item
                })

                existingInterfaces.map((exItem) => {
                    if (exItem.Is_management_interface == true) {
                        let mngmtInterface = {
                            Name: exItem.Name,
                            Ip_address: exItem.Ip_address,
                            Admin_state: exItem.Admin_state,
                            Remote_node_name: exItem.Remote_node_name,
                            Remote_interface: exItem.Remote_interface,
                            Is_management_interface: exItem.Is_management_interface
                        }
                        interfaces.push(mngmtInterface)
                    }
                })

                actNode.interfaces = interfaces
            }
            else {
                existingInterfaces.map((exItem) => {
                    if (exItem.Is_management_interface == true) {
                        let mngmtInterface = {
                            Name: exItem.Name,
                            Ip_address: exItem.Ip_address,
                            Admin_state: exItem.Admin_state,
                            Remote_node_name: exItem.Remote_node_name,
                            Remote_interface: exItem.Remote_interface,
                            Is_management_interface: exItem.Is_management_interface
                        }

                        interfaces.push(mngmtInterface)
                    }
                })
                actNode.interfaces = interfaces
            }
            this.props.action(actNode)
            this.setState({ isOpen: false })
        }
        else {
            let typeChecked = document.getElementById('type').checked
            if (!typeChecked) {
                blankChkCount++
                updatedNode.type = updatedNode.type
            } else {
                updatedNode.type = actNode.type
            }
            let snChecked = document.getElementById('sn').checked
            if (!snChecked) {
                blankChkCount++
                updatedNode.SN = updatedNode.SN
            }
            else {
                updatedNode.SN = actNode.SN
            }
            let kernelChecked = document.getElementById('kernel').checked
            if (!kernelChecked) {
                blankChkCount++
                updatedNode.kernel = updatedNode.kernel
            } else {
                updatedNode.kernel = actNode.kernel
            }
            let isoChecked = document.getElementById('iso').checked
            if (!isoChecked) {
                blankChkCount++
                updatedNode.iso = updatedNode.iso
            } else {
                updatedNode.iso = actNode.iso
            }
            let interfaceChecked = document.getElementById('interface').checked
            let updateInterfaces = updatedNode.interfaces
            if (!interfaceChecked) {
                blankChkCount++

                let blankInterfaceChkCount = 0
                this.totalInterfaces.map((item, index) => {
                    let interfaceId = 'chk' + index
                    let chkInterface = document.getElementById(interfaceId).checked
                    if (chkInterface) {
                        let newInterfc = {}
                        if (item.existingInterface.Is_management_interface) {
                            updateInterfaces[index].Name = item.existingInterface.Name ? item.existingInterface.Name : '',
                                updateInterfaces[index].Ip_address = item.existingInterface.Ip_address ? item.existingInterface.Ip_address : '',
                                updateInterfaces[index].Admin_state = item.existingInterface.Admin_state ? item.existingInterface.Admin_state : '',
                                updateInterfaces[index].Remote_node_name = item.existingInterface.Remote_node_name ? item.existingInterface.Remote_node_name : '',
                                updateInterfaces[index].Remote_interface = item.existingInterface.Remote_interface ? item.existingInterface.Remote_interface : '',
                                updateInterfaces[index].Is_management_interface = item.existingInterface.Is_management_interface

                        } else {
                            item.existingInterface.Name = item.actualInterface.Name ? item.actualInterface.Name : '',
                                item.existingInterface.Ip_address = item.actualInterface.Ip_address ? item.actualInterface.Ip_address : '',
                                item.existingInterface.Admin_state = item.actualInterface.Admin_state ? item.actualInterface.Admin_state : '',
                                item.existingInterface.Remote_node_name = item.actualInterface.Remote_node_name ? item.actualInterface.Remote_node_name : '',
                                item.existingInterface.Remote_interface = item.actualInterface.Remote_interface ? item.actualInterface.Remote_interface : '',
                                item.existingInterface.Is_management_interface = item.actualInterface.Is_management_interface


                            newInterfc.Name = item.actualInterface.Name ? item.actualInterface.Name : '',
                                newInterfc.Ip_address = item.actualInterface.Ip_address ? item.actualInterface.Ip_address : '',
                                newInterfc.Admin_state = item.actualInterface.Admin_state ? item.actualInterface.Admin_state : '',
                                newInterfc.Remote_node_name = item.actualInterface.Remote_node_name ? item.actualInterface.Remote_node_name : '',
                                newInterfc.Remote_interface = item.actualInterface.Remote_interface ? item.actualInterface.Remote_interface : '',
                                newInterfc.Is_management_interface = item.actualInterface.Is_management_interface

                            updateInterfaces.push(newInterfc)
                        }
                    } else {
                        blankChkCount++
                        blankInterfaceChkCount++
                    }
                })



                blankInterfaceChkCount == interfaceCheckboxes.length ? ((updatedNode.interfaces = updatedNode.interfaces) && (updatedNode.interfaces = updatedNode.interfaces)) : ((updatedNode.interfaces = updateInterfaces) && (updatedNode.interfaces = updateInterfaces))

            } else {

                updatedNode.interfaces.map((mngt, mnindex) => {

                    if (mngt.Is_management_interface) {
                        let mngmtInterface = {}
                        mngmtInterface.Name = mngt.Name ? mngt.Name : '',
                            mngmtInterface.Ip_address = mngt.Ip_address ? mngt.Ip_address : '',
                            mngmtInterface.Admin_state = mngt.Admin_state ? mngt.Admin_state : '',
                            mngmtInterface.Remote_node_name = mngt.Remote_node_name ? mngt.Remote_node_name : '',
                            mngmtInterface.Remote_interface = mngt.Remote_interface ? mngt.Remote_interface : '',
                            mngmtInterface.Is_management_interface = mngt.Is_management_interface
                        actNode.interfaces.push(mngmtInterface)
                    }
                })

                updatedNode.interfaces = actNode.interfaces
            }


            if (blankChkCount == checkboxes.length - 1) {
                return this.setState({ blankChkCount: true })
            } else {
                this.props.action(updatedNode)
                this.setState({ isOpen: false })
            }

        }

    }

    cancelAlert = () => {
        this.setState({ showAlert: false });
    }

    toggle = (e) => {
        let checkboxes = document.querySelectorAll('#form1 input[type="checkbox"]')
        for (let i = 0; i < checkboxes.length; i++) {
            if (e.target.checked == true) {
                checkboxes[i].checked = true
            }
            else {
                checkboxes[i].checked = false
            }
        }
    }

    chkInt = (e) => {
        let count = 0
        let interfaceCheckboxes = document.querySelectorAll('#interfaceList input[type="checkbox"]')
        if (e.target.checked == false) {
            document.getElementById('interface').checked = false

        } else {

            this.totalInterfaces.map((item, index) => {
                let interfaceId = 'chk' + index

                let checkedinterface = document.getElementById(interfaceId).checked
                if (checkedinterface) {
                    count++
                }
            })
            if (count == interfaceCheckboxes.length) {
                document.getElementById('interface').checked = true
            }
        }
    }

    chk = (e) => {
        let count = 0
        let checkboxes = document.querySelectorAll('#form1 input[type="checkbox"]')
        let interfaceCheckboxes = document.querySelectorAll('#interfaceList input[type="checkbox"]')
        if (e.target.checked == false) {
            checkboxes[0].checked = false
        }
        else {
            for (let i = 1; i < checkboxes.length; i++) {
                if (checkboxes[i].checked == true) {
                    count++
                }
            }
            if (count == checkboxes.length - 1) {
                checkboxes[0].checked = true
            }
        }

        let interfaceChecked = document.getElementById('interface').checked
        let countInt = 0
        if (interfaceChecked) {
            this.totalInterfaces.map((item, index) => {
                let interfaceId = 'chk' + index
                document.getElementById(interfaceId).checked = true
                countInt++
            })
        } else {
            this.totalInterfaces.map((item, index) => {
                let interfaceId = 'chk' + index
                document.getElementById(interfaceId).checked = false
            })
        }
        if (countInt == interfaceCheckboxes.length) {
            document.getElementById('interface').checked = true
        }
    }

    interfaceList = () => {
        let tempCommonExistInterface = []
        let tempCommonActInterface = []
        let existingInterfaces = this.state.existingNode[0].interfaces
        let actualInterfaces = this.state.actualNode.interfaces

        //to get common interfaces from existing and actual interfaces
        existingInterfaces.map((exitem, index) => {
            if (actualInterfaces && actualInterfaces.length) {
                actualInterfaces.map((acItem, acindex) => {
                    if (exitem.Name == acItem.Name) {
                        tempCommonExistInterface.push(exitem)
                        tempCommonActInterface.push(acItem)
                    }
                })
            }

        })

        let stringTemp = []

        tempCommonExistInterface.map((temp) => {
            stringTemp.push(temp.Name)
        })

        let stringExist = []

        existingInterfaces.map((exist) => {
            stringExist.push(exist.Name)
        })

        let stringAct = []

        if (actualInterfaces && actualInterfaces.length) {
            actualInterfaces.map((act) => {
                stringAct.push(act.Name)
            })
        }
        let unCommonExisting = []

        unCommonExisting = stringExist.filter(function (obj) { return stringTemp.indexOf(obj) == -1; });

        let unCommonExistingInterfaces = []
        unCommonExisting.map((i) => {
            let unCommonExistingInterface = {}
            existingInterfaces.map((exist) => {

                if (exist.Name == i) {
                    unCommonExistingInterface.Name = exist.Name ? exist.Name : ''
                    unCommonExistingInterface.Ip_address = exist.Ip_address ? exist.Ip_address : ''
                    unCommonExistingInterface.Admin_state = exist.Admin_state ? exist.Admin_state : ''
                    unCommonExistingInterface.Remote_node_name = exist.Remote_node_name ? exist.Remote_node_name : ''
                    unCommonExistingInterface.Remote_interface = exist.Remote_interface ? exist.Remote_interface : ''
                    unCommonExistingInterface.Is_management_interface = exist.Is_management_interface
                }
            })
            unCommonExistingInterfaces.push(unCommonExistingInterface)

        })

        let unCommonActual = []

        unCommonActual = stringAct.filter(function (obj) { return stringTemp.indexOf(obj) == -1; });

        let unCommonActualInterfaces = []
        unCommonActual.map((i) => {
            let unCommonActualInterface = {}
            if (actualInterfaces && actualInterfaces.length) {
                actualInterfaces.map((act) => {
                    if (act.Name == i) {
                        unCommonActualInterface.Name = act.Name ? act.Name : ''
                        unCommonActualInterface.Ip_address = act.Ip_address ? act.Ip_address : ''
                        unCommonActualInterface.Admin_state = act.Admin_state ? act.Admin_state : ''
                        unCommonActualInterface.Remote_node_name = act.Remote_node_name ? act.Remote_node_name : ''
                        unCommonActualInterface.Remote_interface = act.Remote_interface ? act.Remote_interface : ''
                        unCommonActualInterface.Is_management_interface = act.Is_management_interface
                    }
                })
            }
            unCommonActualInterfaces.push(unCommonActualInterface)

        })
        let samelen = unCommonExistingInterfaces.length + unCommonActualInterfaces.length
        let sameLenEx = []
        for (let i = 0; i < samelen; i++) {
            if (unCommonExistingInterfaces[i]) {
                sameLenEx[i] = unCommonExistingInterfaces[i]
            }
            else {
                sameLenEx[i] = ''
            }
        }

        for (let i = 0; i < samelen; i++) {
            if (unCommonExistingInterfaces[i]) {
                unCommonActualInterfaces.splice(i, 0, '')
            }
        }

        let finalExistingList = [...tempCommonExistInterface, ...sameLenEx]
        let finalActualList = [...tempCommonActInterface, ...unCommonActualInterfaces]

        let totalCheckBoxLength = finalActualList.length


        let interfaceTable = []


        for (let i = 0; i < totalCheckBoxLength; i++) {
            let interfaceRow = {}
            interfaceRow.name = <input className="form-check-input" type="checkbox" id={"chk" + i} onChange={(e) => { this.chkInt(e) }}></input>

            interfaceRow.existingInterface = {}
            interfaceRow.existingInterface.Name = finalExistingList[i] ? (finalExistingList[i].Name ? finalExistingList[i].Name : '') : ''
            interfaceRow.existingInterface.Ip_address = finalExistingList[i] ? (finalExistingList[i].Ip_address ? finalExistingList[i].Ip_address : '') : ''
            interfaceRow.existingInterface.Admin_state = finalExistingList[i] ? (finalExistingList[i].Admin_state ? finalExistingList[i].Admin_state : '') : ''
            interfaceRow.existingInterface.Remote_node_name = finalExistingList[i] ? (finalExistingList[i].Remote_node_name ? finalExistingList[i].Remote_node_name : '') : ''
            interfaceRow.existingInterface.Remote_interface = finalExistingList[i] ? (finalExistingList[i].Remote_interface ? finalExistingList[i].Remote_interface : '') : ''
            interfaceRow.existingInterface.Is_management_interface = finalExistingList[i] ? (finalExistingList[i].Is_management_interface ? finalExistingList[i].Is_management_interface : false) : false

            interfaceRow.actualInterface = {}
            interfaceRow.actualInterface.Name = finalActualList[i] ? (finalActualList[i].Name ? finalActualList[i].Name : '') : ''
            interfaceRow.actualInterface.Ip_address = finalActualList[i] ? (finalActualList[i].Ip_address ? finalActualList[i].Ip_address : '') : ''
            interfaceRow.actualInterface.Admin_state = finalActualList[i] ? (finalActualList[i].Admin_state ? finalActualList[i].Admin_state : '') : ''
            interfaceRow.actualInterface.Remote_node_name = finalActualList[i] ? (finalActualList[i].Remote_node_name ? finalActualList[i].Remote_node_name : '') : ''
            interfaceRow.actualInterface.Remote_interface = finalActualList[i] ? (finalActualList[i].Remote_interface ? finalActualList[i].Remote_interface : '') : ''
            interfaceRow.actualInterface.Is_management_interface = finalActualList[i] ? (finalActualList[i].Is_management_interface ? finalActualList[i].Is_management_interface : false) : false

            interfaceTable.push(interfaceRow)
        }

        this.totalInterfaces = interfaceTable
        let rows = []



        if (interfaceTable && interfaceTable.length) {
            let row = (<Row>
                <Col sm="6" className='pad'><b>{existingInterfaces.length} existing Interfaces</b></Col>
                <Col sm="6" className='pad'><b>{actualInterfaces ? actualInterfaces.length ? actualInterfaces.length : '0' : ''} actual Interfaces </b></Col>
            </Row>)
            rows.push(row)
            interfaceTable.map((item, index) => {
                let headerClass = 'borderBottom'
                if (index >= tempCommonExistInterface.length) {
                    headerClass = 'borderNone'
                }
                row = (<Row className={headerClass}>
                    <Col sm="2" className='pad'>{item.name ? item.name : '-'}</Col>
                    <Col sm="5" className='pad'>{item.existingInterface.Name} < br />
                        <small>{item.existingInterface.Ip_address ? item.existingInterface.Ip_address : ''}</small>
                    </Col>
                    <Col sm="5" className='pad'>{item.actualInterface.Name} < br />
                        <small>{item.actualInterface.Ip_address ? item.actualInterface.Ip_address : ''}</small>
                    </Col>
                </Row>)
                rows.push(row)
            })
        }
        return rows
    }

    render() {
        let blankChkCount = this.state.blankChkCount
        let err = null
        if (blankChkCount) {
            err = <Alert color="danger" isOpen={this.state.showAlert} toggle={this.cancelAlert}>Please tick minimum one checkbox to proceed!!!</Alert>
        }
        let existingNode = this.state.existingNode[0]
        let actualNode = this.state.actualNode
        let existingInterfaces = existingNode.interfaces
        let actualInterfaces = []
        if (actualNode.interfaces) {
            actualInterfaces = actualNode.interfaces
        }
        else {
            actualInterfaces = []
        }
        return (
            <Modal isOpen={this.state.isOpen} toggle={() => this.cancel()} size="lg" centered="true" >
                <ModalHeader toggle={() => this.cancel()}> Discover Node </ModalHeader>
                {err}
                <ModalBody style={{ margin: '15px' }} id="form1">
                    <Row className="headerRow">
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.toggle(e) }} type="checkbox" id="all" name="all" /></Col>
                        <Col sm="3" className="head-name">Fields</Col>
                        <Col sm="4" className="head-name">Existing values</Col>
                        <Col sm="4" className="head-name">Actual Values</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom">
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="type" name="type" /></Col>
                        <Col sm="3" className="head-name-light">Type</Col>
                        <Col sm="4" className="head-name-light">{existingNode.nodeType}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.type}</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom" >
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="sn" name="sn" /></Col>
                        <Col sm="3" className="head-name-light">Serial Number</Col>
                        <Col sm="4" className="head-name-light">{existingNode.serialNumber}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.serialNumber}</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom" >
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="kernel" name="kernel" /></Col>
                        <Col sm="3" className="head-name-light">Linux kernel</Col>
                        <Col sm="4" className="head-name-light">{existingNode.kernel}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.kernel}</Col>

                    </Row>
                    <Row className="headerRow1 borderBottom" >
                        <Col sm="1" className="head-check"><input className="form-check-input" onChange={(e) => { this.chk(e) }} type="checkbox" id="iso" name="iso" /></Col>
                        <Col sm="3" className="head-name-light">Base Linux Iso</Col>
                        <Col sm="4" className="head-name-light">{existingNode.linuxISO}</Col>
                        <Col sm="4" className="head-name-light">{actualNode.linuxISO}</Col>
                    </Row>
                    <Row className="headerRow1 headerRow3" style={{ marginBottom: '20px' }}>

                        <Col sm="1" className="head-check"><input className="form-check-input" type="checkbox" id="interface" onChange={(e) => { this.chk(e) }} name="interface" /></Col>
                        <Col sm="3" className="head-name-light">Interfaces</Col>

                        <Col sm="8" className="head-name-light" >
                            <div id="interfaceList" >
                                {this.interfaceList()}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="8" style={{ textAlign: 'left' }}><h5>Do you want to replace selected values ?</h5></Col>
                        <Col sm="4" style={{ textAlign: 'right' }}><Button outline className="custBtn" color="primary" onClick={() => (this.action(actualNode))}>Yes</Button>
                            <Button outline className="custBtn" color="primary" onClick={() => (this.cancel())}>No</Button></Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }
}

export default DiscoverModal