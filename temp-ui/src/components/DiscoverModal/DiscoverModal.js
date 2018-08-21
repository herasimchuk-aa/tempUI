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
        actNode.nodeType = actNode.type
        actNode.allInterfaces = actNode.interfaces
        let existingNode = this.state.existingNode[0]
        let updatedNode = existingNode
        let blankChkCount = 0
        if (allChecked) {
            let interfaces = actNode.allInterfaces
            let existingInterfaces = updatedNode.allInterfaces
            if (interfaces && interfaces.length) {
                interfaces = interfaces.map(function (item, index) {
                    item.port = actNode.allInterfaces[index].port
                    item.ip = actNode.allInterfaces[index].ip
                    item.IPAddress = actNode.allInterfaces[index].ip
                    item.admin = actNode.allInterfaces[index].admin
                    item.connectedTo.name = actNode.allInterfaces[index].connectedTo.name
                    item.connectedTo.port = actNode.allInterfaces[index].connectedTo.port
                    item.connectedTo.serverName = actNode.allInterfaces[index].connectedTo.name
                    item.connectedTo.serverPort = actNode.allInterfaces[index].connectedTo.port
                    item.isMngmntIntf = actNode.allInterfaces[index].isMngmntIntf
                    return item
                })

                existingInterfaces.map((exItem) => {
                    if (exItem.isMngmntIntf == true) {
                        let mngmtInterface = {
                            port: exItem.port,
                            ip: exItem.ip,
                            IPAddress: exItem.IPAddress,
                            admin: exItem.admin,
                            connectedTo: {
                                name: exItem.connectedTo.name,
                                port: exItem.connectedTo.port,
                                serverName: exItem.connectedTo.serverName,
                                serverPort: exItem.connectedTo.serverPort,
                            },
                            isMngmntIntf: exItem.isMngmntIntf
                        }

                        interfaces.push(mngmtInterface)
                    }
                })

                actNode.allInterfaces = interfaces
            }
            else {
                existingInterfaces.map((exItem) => {
                    if (exItem.isMngmntIntf == true) {
                        let mngmtInterface = {
                            port: exItem.port,
                            ip: exItem.ip,
                            IPAddress: exItem.IPAddress,
                            admin: exItem.admin,
                            connectedTo: {
                                name: exItem.connectedTo.name,
                                port: exItem.connectedTo.port,
                                serverName: exItem.connectedTo.serverName,
                                serverPort: exItem.connectedTo.serverPort,
                            },
                            isMngmntIntf: exItem.isMngmntIntf
                        }

                        interfaces.push(mngmtInterface)
                    }
                })
                actNode.allInterfaces = interfaces
            }
            this.props.action(actNode)
            this.setState({ isOpen: false })
        }
        else {
            let typeChecked = document.getElementById('type').checked
            if (!typeChecked) {
                blankChkCount++
                updatedNode.nodeType = updatedNode.nodeType
            } else {
                updatedNode.nodeType = actNode.nodeType
            }
            let snChecked = document.getElementById('sn').checked
            if (!snChecked) {
                blankChkCount++
                updatedNode.serialNumber = updatedNode.serialNumber
            }
            else {
                updatedNode.serialNumber = actNode.serialNumber
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
                updatedNode.linuxISO = updatedNode.linuxISO
            } else {
                updatedNode.linuxISO = actNode.linuxISO
            }
            let interfaceChecked = document.getElementById('interface').checked
            let updateInterfaces = updatedNode.allInterfaces
            if (!interfaceChecked) {
                blankChkCount++

                let blankInterfaceChkCount = 0
                this.totalInterfaces.map((item, index) => {
                    let interfaceId = 'chk' + index
                    let chkInterface = document.getElementById(interfaceId).checked
                    if (chkInterface) {
                        let newInterfc = {}
                        if (item.existingInterface.isMngmntIntf) {
                            updateInterfaces[index].port = item.existingInterface.port ? item.existingInterface.port : '',
                                updateInterfaces[index].ip = item.existingInterface.ip ? item.existingInterface.ip : '',
                                updateInterfaces[index].IPAddress = item.existingInterface.ip ? item.existingInterface.ip : '',
                                updateInterfaces[index].admin = item.existingInterface.admin ? item.existingInterface.admin : '',
                                updateInterfaces[index].connectedTo = {}
                            updateInterfaces[index].connectedTo = item.existingInterface.connectedTo ? item.existingInterface.connectedTo : {},
                                updateInterfaces[index].connectedTo.name = item.existingInterface.connectedTo.name ? item.existingInterface.connectedTo.name : '',
                                updateInterfaces[index].connectedTo.port = item.existingInterface.connectedTo.port ? item.existingInterface.connectedTo.port : '',
                                updateInterfaces[index].connectedTo.serverName = item.existingInterface.connectedTo.serverName ? item.existingInterface.connectedTo.serverName : '',
                                updateInterfaces[index].connectedTo.serverPort = item.existingInterface.connectedTo.serverPort ? item.existingInterface.connectedTo.serverPort : '',
                                updateInterfaces[index].isMngmntIntf = item.existingInterface.isMngmntIntf

                        } else {
                            item.existingInterface.port = item.actualInterface.port ? item.actualInterface.port : '',
                                item.existingInterface.ip = item.actualInterface.ip ? item.actualInterface.ip : '',
                                item.existingInterface.IPAddress = item.actualInterface.ip ? item.actualInterface.ip : '',
                                item.existingInterface.admin = item.actualInterface.admin ? item.actualInterface.admin : '',
                                item.existingInterface.connectedTo = item.actualInterface.connectedTo ? item.actualInterface.connectedTo : {},
                                item.existingInterface.connectedTo.name = item.actualInterface.connectedTo.name ? item.actualInterface.connectedTo.name : '',
                                item.existingInterface.connectedTo.port = item.actualInterface.connectedTo.port ? item.actualInterface.connectedTo.port : '',
                                item.existingInterface.connectedTo.serverName = item.actualInterface.connectedTo.serverName ? item.actualInterface.connectedTo.serverName : '',
                                item.existingInterface.connectedTo.serverPort = item.actualInterface.connectedTo.serverPort ? item.actualInterface.connectedTo.serverPort : '',
                                item.existingInterface.isMngmntIntf = item.actualInterface.isMngmntIntf


                            newInterfc.port = item.actualInterface.ip ? item.actualInterface.port : '',
                                newInterfc.ip = item.actualInterface.ip ? item.actualInterface.ip : '',
                                newInterfc.IPAddress = item.actualInterface.ip ? item.actualInterface.ip : '',
                                newInterfc.admin = item.actualInterface.admin ? item.actualInterface.admin : '',
                                newInterfc.connectedTo = {}
                            newInterfc.connectedTo = item.actualInterface.connectedTo ? item.actualInterface.connectedTo : {},
                                newInterfc.connectedTo.name = item.actualInterface.connectedTo.name ? item.actualInterface.connectedTo.name : '',
                                newInterfc.connectedTo.port = item.actualInterface.connectedTo.port ? item.actualInterface.connectedTo.port : '',
                                newInterfc.connectedTo.serverName = item.actualInterface.connectedTo.serverName ? item.actualInterface.connectedTo.serverName : '',
                                newInterfc.connectedTo.serverPort = item.actualInterface.connectedTo.serverPort ? item.actualInterface.connectedTo.serverPort : '',
                                newInterfc.isMngmntIntf = item.actualInterface.isMngmntIntf

                            updateInterfaces.push(newInterfc)
                        }
                    } else {
                        blankChkCount++
                        blankInterfaceChkCount++
                    }
                })



                blankInterfaceChkCount == interfaceCheckboxes.length ? ((updatedNode.allInterfaces = updatedNode.allInterfaces) && (updatedNode.interfaces = updatedNode.allInterfaces)) : ((updatedNode.allInterfaces = updateInterfaces) && (updatedNode.interfaces = updateInterfaces))

            } else {

                updatedNode.allInterfaces.map((mngt, mnindex) => {

                    if (mngt.isMngmntIntf) {
                        let mngmtInterface = {}
                        mngmtInterface.port = mngt.port ? mngt.port : '',
                            mngmtInterface.ip = mngt.ip ? mngt.ip : '',
                            mngmtInterface.IPAddress = mngt.ip ? mngt.ip : '',
                            mngmtInterface.admin = mngt.admin ? mngt.admin : '',
                            mngmtInterface.connectedTo = {}
                        mngmtInterface.connectedTo = mngt.connectedTo ? mngt.connectedTo : {},
                            mngmtInterface.connectedTo.name = mngt.connectedTo.name ? mngt.connectedTo.name : '',
                            mngmtInterface.connectedTo.port = mngt.connectedTo.port ? mngt.connectedTo.port : '',
                            mngmtInterface.connectedTo.serverName = mngt.connectedTo.serverName ? mngt.connectedTo.serverName : '',
                            mngmtInterface.connectedTo.serverPort = mngt.connectedTo.serverPort ? mngt.connectedTo.serverPort : '',
                            mngmtInterface.isMngmntIntf = mngt.isMngmntIntf
                        actNode.allInterfaces.push(mngmtInterface)
                    }
                })

                updatedNode.allInterfaces = actNode.allInterfaces
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
        let tempCommonInterface = []
        let existingInterfaces = this.state.existingNode[0].allInterfaces
        let actualInterfaces = this.state.actualNode.interfaces

        //to get common interfaces from existing and actual interfaces
        existingInterfaces.map((exitem, index) => {
            actualInterfaces.map((acItem, acindex) => {
                if (exitem.port == acItem.port) {
                    tempCommonInterface.push(exitem)
                }
            })
        })

        let stringTemp = []

        tempCommonInterface.map((temp) => {
            stringTemp.push(temp.port)
        })

        let stringExist = []

        existingInterfaces.map((exist) => {
            stringExist.push(exist.port)
        })

        let stringAct = []

        actualInterfaces.map((act) => {
            stringAct.push(act.port)
        })

        let unCommonExisting = []

        unCommonExisting = stringExist.filter(function (obj) { return stringTemp.indexOf(obj) == -1; });

        let unCommonExistingInterfaces = []
        unCommonExisting.map((i) => {
            let unCommonExistingInterface = {}
            existingInterfaces.map((exist) => {

                if (exist.port == i) {
                    unCommonExistingInterface.port = exist.port ? exist.port : ''
                    unCommonExistingInterface.ip = exist.ip ? exist.ip : ''
                    unCommonExistingInterface.IPAddress = exist.ip ? exist.ip : ''
                    unCommonExistingInterface.admin = exist.admin ? exist.admin : ''
                    unCommonExistingInterface.connectedTo = {}
                    unCommonExistingInterface.connectedTo.name = exist.connectedTo.name ? exist.connectedTo.name : ''
                    unCommonExistingInterface.connectedTo.port = exist.connectedTo.port ? exist.connectedTo.port : ''
                    unCommonExistingInterface.connectedTo.serverName = exist.connectedTo.name ? exist.connectedTo.name : ''
                    unCommonExistingInterface.connectedTo.serverPort = exist.connectedTo.port ? exist.connectedTo.port : ''
                    unCommonExistingInterface.isMngmntIntf = exist.isMngmntIntf
                }
            })
            unCommonExistingInterfaces.push(unCommonExistingInterface)

        })

        let unCommonActual = []

        unCommonActual = stringAct.filter(function (obj) { return stringTemp.indexOf(obj) == -1; });

        let unCommonActualInterfaces = []
        unCommonActual.map((i) => {
            let unCommonActualInterface = {}
            actualInterfaces.map((act) => {
                if (act.port == i) {
                    unCommonActualInterface.port = act.port ? act.port : ''
                    unCommonActualInterface.ip = act.ip ? act.ip : ''
                    unCommonActualInterface.IPAddress = act.ip ? act.ip : ''
                    unCommonActualInterface.admin = act.admin ? act.admin : ''
                    unCommonActualInterface.connectedTo = {}
                    unCommonActualInterface.connectedTo.name = act.connectedTo.name ? act.connectedTo.name : ''
                    unCommonActualInterface.connectedTo.port = act.connectedTo.port ? act.connectedTo.port : ''
                    unCommonActualInterface.connectedTo.serverName = act.connectedTo.name ? act.connectedTo.name : ''
                    unCommonActualInterface.connectedTo.serverPort = act.connectedTo.port ? act.connectedTo.port : ''
                    unCommonActualInterface.isMngmntIntf = act.isMngmntIntf
                }
            })
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

        let finalExistingList = [...tempCommonInterface, ...sameLenEx]
        let finalActualList = [...tempCommonInterface, ...unCommonActualInterfaces]

        let totalCheckBoxLength = finalActualList.length


        let interfaceTable = []


        for (let i = 0; i < totalCheckBoxLength; i++) {
            let interfaceRow = {}
            interfaceRow.name = <input className="form-check-input" type="checkbox" id={"chk" + i} onChange={(e) => { this.chkInt(e) }}></input>

            interfaceRow.existingInterface = {}
            interfaceRow.existingInterface.port = finalExistingList[i] ? (finalExistingList[i].port ? finalExistingList[i].port : '') : ''
            interfaceRow.existingInterface.ip = finalExistingList[i] ? (finalExistingList[i].ip ? finalExistingList[i].ip : '') : ''
            interfaceRow.existingInterface.IPAddress = finalExistingList[i] ? (finalExistingList[i].IPAddress ? finalExistingList[i].IPAddress : '') : ''
            interfaceRow.existingInterface.admin = finalExistingList[i] ? (finalExistingList[i].admin ? finalExistingList[i].admin : '') : ''
            interfaceRow.existingInterface.connectedTo = {}
            interfaceRow.existingInterface.connectedTo.name = finalExistingList[i] ? (finalExistingList[i].connectedTo.name ? finalExistingList[i].connectedTo.name : '') : ''
            interfaceRow.existingInterface.connectedTo.port = finalExistingList[i] ? (finalExistingList[i].connectedTo.port ? finalExistingList[i].connectedTo.port : '') : ''
            interfaceRow.existingInterface.connectedTo.serverName = finalExistingList[i] ? (finalExistingList[i].connectedTo.serverName ? finalExistingList[i].connectedTo.serverName : '') : ''
            interfaceRow.existingInterface.connectedTo.serverPort = finalExistingList[i] ? (finalExistingList[i].connectedTo.serverPort ? finalExistingList[i].connectedTo.serverPort : '') : ''
            interfaceRow.existingInterface.isMngmntIntf = finalExistingList[i] ? (finalExistingList[i].isMngmntIntf ? finalExistingList[i].isMngmntIntf : false) : false

            interfaceRow.actualInterface = {}
            interfaceRow.actualInterface.port = finalActualList[i] ? (finalActualList[i].port ? finalActualList[i].port : '') : ''
            interfaceRow.actualInterface.ip = finalActualList[i] ? (finalActualList[i].ip ? finalActualList[i].ip : '') : ''
            interfaceRow.actualInterface.IPAddress = finalActualList[i] ? (finalActualList[i].IPAddress ? finalActualList[i].IPAddress : '') : ''
            interfaceRow.actualInterface.admin = finalActualList[i] ? (finalActualList[i].admin ? finalActualList[i].admin : '') : ''
            interfaceRow.actualInterface.connectedTo = {}
            interfaceRow.actualInterface.connectedTo.name = finalActualList[i] ? (finalActualList[i].connectedTo.name ? finalActualList[i].connectedTo.name : '') : ''
            interfaceRow.actualInterface.connectedTo.port = finalActualList[i] ? (finalActualList[i].connectedTo.port ? finalActualList[i].connectedTo.port : '') : ''
            interfaceRow.actualInterface.connectedTo.serverName = finalActualList[i] ? (finalActualList[i].connectedTo.serverName ? finalActualList[i].connectedTo.serverName : '') : ''
            interfaceRow.actualInterface.connectedTo.serverPort = finalActualList[i] ? (finalActualList[i].connectedTo.serverPort ? finalActualList[i].connectedTo.serverPort : '') : ''
            interfaceRow.actualInterface.isMngmntIntf = finalActualList[i] ? (finalActualList[i].isMngmntIntf ? finalActualList[i].isMngmntIntf : false) : false

            interfaceTable.push(interfaceRow)
        }

        this.totalInterfaces = interfaceTable
        let rows = []



        if (interfaceTable && interfaceTable.length) {
            let row = (<Row>
                <Col sm="6" className='pad'><b>{existingInterfaces.length} existing Interfaces</b></Col>
                <Col sm="6" className='pad'><b>{actualInterfaces.length} actual Interfaces </b></Col>
            </Row>)
            rows.push(row)
            interfaceTable.map((item, index) => {
                let headerClass = 'borderBottom'
                if (index >= tempCommonInterface.length) {
                    headerClass = 'borderNone'
                }
                row = (<Row className={headerClass}>
                    <Col sm="2" className='pad'>{item.name ? item.name : '-'}</Col>
                    <Col sm="5" className='pad'>{item.existingInterface.port} < br />
                        <small>{item.existingInterface.IPAddress ? item.existingInterface.IPAddress : ''}</small>
                    </Col>
                    <Col sm="5" className='pad'>{item.actualInterface.port} < br />
                        <small>{item.actualInterface.IPAddress ? item.actualInterface.IPAddress : ''}</small>
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
        let existingInterfaces = existingNode.allInterfaces
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