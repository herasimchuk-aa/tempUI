import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import '../../views.css';
import { ServerAPI } from '../../../ServerAPI';

class BaseLinuxIso extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            showDelete : false,
            selectedRowIndex: [],
            displayModel: false,
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllIso(this.retrieveData, this);
    }

    retrieveData(instance, data) {
        if (Object.keys(data).length) {
            instance.setState({ data: data });
        }
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteISO())}>Delete</Button>);
            return a;
        }
        else   
            return null;
    }

    deleteISO = () => {
        
    }


    drawHeader() {
        return (<Row className="headerRow">
          <Col sm="1" className="head-name">  </Col>
            <Col sm="3" className="head-name">Name</Col>
            <Col sm="8" className="head-name">Description</Col>
        </Row>)
    }

    drawtable() {
        let { data } = this.state
        let rows = []
        let header = this.drawHeader()
        rows.push(header)
        if (data && data.length) {
            let iso = data;
            iso.map((baseLinuxIso, i) => {
                let row1 = 'headerRow2'

                if (i % 2 === 0) {
                    row1 = 'headerRow1'
                }
                if (i == iso.length - 1) {
                    row1 = row1 + ' headerRow3 '
                }
                let row = (<Row className={row1}>
                <Col sm="1" className="pad"><Input className="marLeft40" type="checkbox" onChange={() => (this.checkBoxClick(i))}></Input></Col>
                    <Col sm="3" className="pad">{baseLinuxIso.label}</Col>
                    <Col sm="8" className="pad">{baseLinuxIso.description}</Col>
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
                    <ModalHeader>Add Base Linux ISO</ModalHeader>
                    <ModalBody>
                        Name: <Input id='isoName' /><br />
                        Description: <Input id='isoDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={() => (this.addRole())}>Add</Button>{'  '}
                        <Button outline color="secondary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel })
    }

    addRole() {
        let a = {
            'Name': document.getElementById('isoName').value,
            'Description': document.getElementById('isoDesc').value
        }
        ServerAPI.DefaultServer().addIso(this.callback, this, a);
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
                <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                {this.showDeleteButton()}
                {table}

                {this.renderUpgradeModelDialog()}
            </div>
        );
    }



}

export default BaseLinuxIso;