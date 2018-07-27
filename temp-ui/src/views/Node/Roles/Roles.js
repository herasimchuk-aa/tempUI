import React, { Component } from 'react';
import {  Row, Col, Button,  Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert} from 'reactstrap';
import '../../views.css';
import {ServerAPI} from '../../../ServerAPI';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import {roleHead} from '../../../consts'
import DropDown from '../../../components/dropdown/DropDown';
// import $ from 'jquery';

class Roles extends Component {

	constructor(props){
        super(props)
        this.state = {
            data:[],
            roleHead: roleHead,
            displayModel: false,
            selectedRowIndexes: [],
            showDelete: false,
            alertVisible: false,
            selectedRole: '',
            displayRoleUpdateModel: false,
            updateRowIndex:null,
            selectedParentRole:null
        }
    }

    componentDidMount(){
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveData,this);
    }

    retrieveData(instance, data) {
        if(data === undefined) {
            alert("No data received");
        }
        else {
                instance.setState({data: data,selectedRowIndexes:[]});
        }
    }

    checkBoxClick = (rowIndex) =>{
        let { selectedRowIndexes } = this.state
        let arrayIndex = selectedRowIndexes.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndexes.splice(arrayIndex, 1)
        } else {
            selectedRowIndexes.push(rowIndex)
        }
        if(this.state.selectedRowIndexes.length > 0) {
            this.setState({showDelete : true});
        }
        else {
            this.setState({showDelete : false});
        }
    }

<<<<<<< Updated upstream
    // checkBoxClick = (rowIndex) =>{
    //    console.log(rowIndex)
    
    // }

    toggleModel = (rowIndex) => {
        this.setState({updateRowIndex:rowIndex})
        this.setState({displayRoleUpdateModel : !this.state.displayRoleUpdateModel})
    }


    updateModel = () => {
        let data = this.state.data
        let currentRole = null

        data.map((datum,index) => {
            if(index == this.state.updateRowIndex){
                currentRole = datum
            }
           
        })
        
        
        if (this.state.displayRoleUpdateModel) {
            this.setState({selectedRole:currentRole.parent})
            return (
                <Modal isOpen={this.state.displayRoleUpdateModel} toggle={() => this.cancelRoleModel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancelRoleModel()}>Update Role--{this.state.selectedRole}--</ModalHeader>
                    <ModalBody>
                      Parent Role: <DropDown className="marTop10" id='rolePUpdate' options={this.state.data}  getSelectedData={this.getSelectedData} identity={"Role"} default={currentRole.parent}/><br /> 
                        Name: <Input autoFocus className="marTop10" id='roleNameUpdate' defaultValue={currentRole.label}/><br />
                        Description: <Input className="marTop10" id='roleDescUpdate' defaultValue={currentRole.description}/><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="primary" onClick={()=>(this.updateRole())}>Update</Button>{'  '}
                        <Button outline color="primary" onClick={()=>(this.cancelRoleModel())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

   
    updateRole = () => {
        if(!document.getElementById('roleNameUpdate').value) {
            this.setState({alertVisible : true});
                return;
        }   
        let desc = document.getElementById('roleDescUpdate').value  
        let roleName = document.getElementById('rolePUpdate').value
        let a = {
            
            'Name' : roleName,
            'Description': desc,
          
        }
        this.roleN =  roleName
        this.descr = desc
        ServerAPI.DefaultServer().updateRole(this.roleUpdateCallback,this,a);
    }

    roleUpdateCallback(instance, data) {
        let arr = instance.state.data
        arr[instance.state.updateRowIndex].label = instance.roleN
        arr[instance.state.updateRowIndex].description = instance.descr

        instance.setState({data: arr, displayRoleUpdateModel: !instance.state.displayRoleUpdateModel, selectedParentRole: ''})
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveData,this);
    }

    cancelRoleModel = () => {
        this.setState({displayRoleUpdateModel : !this.state.displayRoleUpdateModel})
    }

    
=======

>>>>>>> Stashed changes
    showDeleteButton() {
        let a = [];
        if(this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteRole())}>Delete</Button>);
            return a;
        }
        else   
            return null;
    }

<<<<<<< Updated upstream
    getSelectedData= (data,identity) => {
        
        if(identity == 'Role') {
          this.setState({ selectedRole : data })
         
=======
    getSelectedData = (data, identity) => {
        if (identity == 'Role') {
            this.setState({ selectedRole: data })
>>>>>>> Stashed changes
        }
      }

    renderUpgradeModelDialog() {
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="sm" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add Role</ModalHeader>
                    <ModalBody>
                    <Alert color="danger" isOpen={this.state.alertVisible} toggle={() => this.onDismiss()} >Role Name cannot be empty</Alert>
=======
                        Parent Role <DropDown className="marTop10" options={this.state.data} getSelectedData={this.getSelectedData} identity={"Role"} /><br />
                        Name <Input autoFocus className="marTop10" id='roleName' /><br />
                        Description <Input className="marTop10" id='roleDesc' /><br />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={()=>(this.addRole())}>Add</Button>
                        <Button className="custBtn" outline color="primary" onClick={()=>(this.cancel())}>Cancel</Button>

                    </ModalFooter>
                </Modal>
            );
        }
    }

    cancel() {
        this.setState({displayModel : !this.state.displayModel})
    }
    onDismiss() {
        this.setState({alertVisible : false});
    }
    

    addRole() {
        if(!document.getElementById('roleName').value) {
            this.setState({alertVisible : true});
                return;
        }            
        let a = {
            'Parent' : this.state.selectedRole,
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
        instance.setState({data: a, displayModel: !instance.state.displayModel, selectedRole: ''})
    }

    deleteRole() {
        for( let i = 0; i < this.state.selectedRowIndexes.length; i++) {
            ServerAPI.DefaultServer().deleteRole(this.callbackDelete,this,this.state.data[this.state.selectedRowIndexes[i]].label);
        }
        this.setState({showDelete: !this.state.showDelete, selectedRowIndexes: []});
    }

    callbackDelete = (instance) => {
        ServerAPI.DefaultServer().fetchAllRoles(this.retrieveData,this);
    }

    render() { 
        return (
           <div>
               <Row >
                    <Button className="custBtn animated fadeIn" id="add" outline color="secondary" onClick={() => (this.cancel())}>New</Button>
                    {this.showDeleteButton()}
<<<<<<< Updated upstream
               </Row>
				<Row className="tableTitle">Roles</Row>				<SummaryDataTable heading={this.state.roleHead} data={this.state.data} toggleModel={this.toggleModel} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes} />                {this.renderUpgradeModelDialog()}
                {this.updateModel()}            </div> 
=======
                </Row>
                <Row className="tableTitle">Roles</Row>
               <SummaryDataTable heading={this.state.roleHead} data={this.state.data} checkBoxClick={this.checkBoxClick} selectedRowIndexes={this.state.selectedRowIndexes}/>
                {this.renderUpgradeModelDialog()}
            </div> 
>>>>>>> Stashed changes
        );
    }

    

}

export default Roles;