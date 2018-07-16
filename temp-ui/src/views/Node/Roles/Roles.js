import React, { Component } from 'react';
import { Container, Row, Col, Button,  Modal, ModalHeader, ModalBody, ModalFooter, Input, ListGroup, ListGroupItem } from 'reactstrap';
import '../../views.css';
import {ServerAPI} from '../../../ServerAPI';

class Roles extends Component {

	constructor(props){
        super(props)
        this.state = {
            data:[],
            displayModel: false,
            selectedRowIndex: [],
            selectedRows: [],
            showDelete: false
        }
    }

    componentDidMount(){
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveData,this);
    }

    retrieveData(instance, data) {
        if(!data) {
            alert("No data received");
        }
        else {
            if(Object.keys(data).length) {
                instance.setState({data: data});
            }
        }
        
    }

    drawHeader(){
        return(
        <Row className="headerRow">
            <Col sm="1" className="head-name">  </Col>
            <Col sm="3" className="head-name">Name</Col>
            <Col sm="8" className="head-name">Description</Col>
        </Row>
        )
    }

    drawtable(){
        let {data} = this.state
        let rows = []
        let header = this.drawHeader()
        rows.push(header)
        if(data && data.length){
             let roles = data;
             roles.map( (role,i) => {
                let row1 = 'headerRow1'

                if(i%2 === 0){
                    row1 = 'headerRow2'
                }
                if (i == roles.length - 1) {
                    row1 =  row1 +' headerRow3 '
                }
                let row  =  ( <Row className={row1}>
                     <Col sm="1" className="pad"><Input className="marLeft40" type="checkbox" onChange={() => (this.checkBoxClick(i))}></Input></Col>
                     <Col sm="3" className="pad">{role.label}</Col>
                     <Col sm="8" className="pad">{role.description}</Col>
                    </Row>)
                rows.push(row)
            } )  
        }
        return rows 
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
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteRole())}>Delete</Button>);
            return a;
        }
        else   
            return null;
    }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} size="sm" centered="true" >
                    <ModalHeader>Add Role</ModalHeader>
                    <ModalBody>
                        Name: <Input id='roleName'/><br />
                        Description: <Input id='roleDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={()=>(this.addRole())}>Add</Button>{'  '}
                        <Button outline color="secondary" onClick={()=>(this.click())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    click() {
        this.setState({displayModel : !this.state.displayModel})
    }

    addRole() {
        if(!document.getElementById('roleName').value) {
            alert("Role Name cannot be empty");
            return;
        }            
        let a = {
            'Name' : document.getElementById('roleName').value,
            'Description': document.getElementById('roleDesc').value
    }
        ServerAPI.DefaultServer().addRole(this.callback,this,a);
    }

    callback(instance, data) {
        let a = instance.state.data
        if(!a) {
           a = []
        }
        a.push(data)
        instance.setState({data: a})
        instance.click();
    }

    deleteRole() {
        console.log(this.state.selectedRowIndex);
    }

    render() { 
        let table = this.drawtable()
        return (
           <div>
               <Row >
                    <Button className="custBtn animated fadeIn" id="add" outline color="secondary" onClick={() => (this.click())}>New</Button>
                    
                    {this.showDeleteButton()}
               </Row>
                {table}
                {this.renderUpgradeModelDialog()}
            </div> 
        );
    }

    

}

export default Roles;