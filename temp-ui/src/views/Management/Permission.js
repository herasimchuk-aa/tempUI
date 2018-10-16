import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Media, Button } from 'reactstrap'
import { getPermissions, addPermission, updatePermission, deletePermission, setPermissionHeadings } from '../../actions/permissionActions';
import DropDown from '../../components/dropdown/DropDown';
import { FETCH_ALL_PERMISSIONS, FETCH_ALL_ENTITIES } from '../../apis/RestConfig';
import { fetchAllEntities } from '../../actions/entityAction';

class Permission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayModel: false,
            displayEditModal: false,
            selectedEntity: ''
            // entityData: [{ 'Id': 1, 'Name': 'e1' }, { 'Id': 2, 'Name': 'e2' }, { 'Id': 3, 'Name': 'e3' }]
        }
    }

    componentDidMount() {
        this.props.getPermission(FETCH_ALL_PERMISSIONS)
        this.props.fetchAllEntities(FETCH_ALL_ENTITIES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            entityData: props.entityData ? props.entityData.toJS() : [],
            permissionHead: props.permissionHead ? props.permissionHead.toJS() : permissionHead
        }
    }

    toggle() {
        this.setState({ displayModel: !this.state.displayModel })
    }

    getSelectedData = (data, identity) => {
        if (identity == 'Entity') {
            this.setState({ selectedEntity: data })
        }
    }

    addPermissionModal() {
        if (this.state.displayModel) {
            let header = (
                <Row>
                    <Col md="8" className="pad">Entities</Col>
                    <Col md="1" className="pad">C</Col>
                    <Col md="1" className="pad">R</Col>
                    <Col md="1" className="pad">U</Col>
                    <Col md="1" className="pad">D</Col>
                </Row>
            )
            let data = []
            data.push(
                <Row>
                    <Col md="8" className="pad"><DropDown className="marTop10" options={this.state.entityData} getSelectedData={this.getSelectedData} identity={"Entity"} default={this.state.selectedEntity} /></Col>
                    <Col md="1" className="pad"><input type="checkbox" id={"_C"} defaultChecked={false} /></Col>
                    <Col md="1" className="pad"><input type="checkbox" id={"_R"} defaultChecked={false} /></Col>
                    <Col md="1" className="pad"><input type="checkbox" id={"_U"} defaultChecked={false} /></Col>
                    <Col md="1" className="pad"><input type="checkbox" id={"_D"} defaultChecked={false} /></Col>
                </Row>)
            // for (let i = 0; i < this.state.entityData.length; i++) {
            //     let key = this.state.entityData[i].Id
            //     data.push(<Row>
            //         <Col md="4" className="pad"><font>{this.state.entityData[i].Name}</font></Col>
            //         <Col md="2" className="pad"><input type="checkbox" id={key + "_C"} defaultChecked={false} /></Col>
            //         <Col md="2" className="pad"><input type="checkbox" id={key + "_R"} defaultChecked={false} /></Col>
            //         <Col md="2" className="pad"><input type="checkbox" id={key + "_U"} defaultChecked={false} /></Col>
            //         <Col md="2" className="pad"><input type="checkbox" id={key + "_D"} defaultChecked={false} /></Col>
            //     </Row>)
            // }

            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.toggle()} size="md" centered="true" >
                    <ModalHeader autoFocus toggle={() => this.toggle()}>Add Permission</ModalHeader>
                    <ModalBody>
                        {header}
                        {data}
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addPermission())}>Add</Button>{'  '}
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggle())}>Cancel</Button>
                    </ModalFooter>
                </Modal>)

        }

    }

    addPermission() {
        let data = document.querySelectorAll("input[type='checkbox']:checked")
        let d = []
        let b = []
        for (let i = 0; i < data.length; i++) {
            // d.push(data[i].id.split('_'))
            let a = data[i].id.split('_')
            this.state.entityData.find(item => {
                if (item.Id == a[0]) {
                    let obj = {
                        'entity': item.Name,
                        'role': a[1]
                    }
                    b.push(obj)
                }

            })
        }
        console.log(d)
        console.log(b)
    }

    render() {
        return (
            <div className="App">
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">Permission</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.toggle())} className="custBtn animated fadeIn marginLeft13N">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                        </div>
                    </Media>
                </Media>
                {this.addPermissionModal()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.permissionReducer.get('permissions'),
        entityData: state.entityReducer.get('entities'),
        permissionHead: state.permissionReducer.get('permissionHeadings')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPermission: (url) => dispatch(getPermissions(url)),
        fetchAllEntities: (url) => dispatch(fetchAllEntities(url)),
        addPermission: (url, params) => dispatch(addPermission(url, params)),
        updatePermission: (url, params) => dispatch(updatePermission(url, params)),
        deletePermissions: (url, params) => dispatch(deletePermission(url, params)),
        setPermissionHeadings: (params) => dispatch(setPermissionHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Permission);;
