import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';

class LinuxKernel extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            showDelete : false,
            selectedRowIndex: [],
            displayModel: false
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllKernels(this.retrieveData, this);
    }

    retrieveData(instance, data) {
        if (Object.keys(data).length) {
            instance.setState({ data: data });
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

    checkBoxClick = (rowIndex) =>{
        let { selectedRowIndex } = this.state
        let arrayIndex = selectedRowIndex.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndex.splice(arrayIndex, 1)
        } else {
            selectedRowIndex.push(rowIndex)
        }
        if(this.state.selectedRowIndex.length > 0) {
            this.setState({showDelete : true});
        }
        else {
            this.setState({showDelete : false});
        }
    }

    
    showDeleteButton() {
        let a = [];
        if(this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteKernel())}>Delete</Button>);
            return a;
        }
        else   
            return null;
    }

    deleteKernel = () => {
        
    }


    drawtable() {
        let { data } = this.state
        let rows = []
        let header = this.drawHeader()
        rows.push(header)
        if (data && data.length) {
            let kernel = data;
            kernel.map((linuxKernel, i) => {
                let row1 = 'headerRow2'

                if (i % 2 === 0) {
                    row1 = 'headerRow1'
                }
                if (i == kernel.length - 1) {
                    row1 = row1 + ' headerRow3 '
                }
                let row = (<Row className={row1}>
                    <Col sm="1" className="pad"><Input className="marLeft40" type="checkbox" onChange={() => (this.checkBoxClick(i))}></Input></Col>
                    <Col sm="4" className="pad">{linuxKernel.label}</Col>
                    <Col sm="4" className="pad">{linuxKernel.description}</Col>
                    {/* <Col sm="4" className="pad">{linuxKernel.value}</Col> */}
                </Row>)
                rows.push(row)
            })
        }
        return rows
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} size="sm" centered="true" >
                    <ModalHeader>Add Linux Kernel</ModalHeader>
                    <ModalBody>
                        Name: <Input id='kernelName' /><br />
                        Description: <Input id='kernelDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={() => (this.addKernel())}>Add</Button>{'  '}
                        <Button outline color="secondary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel })
    }

    addKernel() {
        let a = {
            'Name': document.getElementById('kernelName').value,
            'Description': document.getElementById('kernelDesc').value
        }
        ServerAPI.DefaultServer().addKernel(this.callback, this, a);
    }

    callback(instance, data) {
        let a = instance.state.data
        if (!a) {
            a = []
        }
        a.push(data)
        instance.setState({ data: a })
        instance.cancel();
    }


    render() {
        let table = this.drawtable()
        return (
            <div>
                <Row>
                <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                {this.showDeleteButton()}
                </Row>
                {table}
                {this.renderUpgradeModelDialog()}
            </div>
        );
    }



}

export default LinuxKernel;