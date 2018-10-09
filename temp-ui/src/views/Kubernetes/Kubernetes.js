import React, { Component } from 'react';
import { Label, Row, Col, Button, Input, Media, Card, CardHeader, CardBody, InputGroup, InputGroupAddon } from 'reactstrap';
import '../views.css';
import { ServerAPI } from '../../ServerAPI';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { FETCH_ALL_KUBERNETES } from '../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getk8 } from '../../actions/kubernetesAction';

class Kubernetes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedRowIndex: [],
            deployModal: false
        }
    }

    componentDidMount() {
        this.props.getk8(FETCH_ALL_KUBERNETES)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : []
        }
    }

    dashboardClick = (key) => {
        let kubernetesData = this.state.data;
        let keyData = kubernetesData[key]
        let counter = 0
        if (keyData && keyData.length) {
            for (let i in keyData) {
                let roles = keyData[i].roles
                if (roles && roles.length) {
                    roles.map((role) => {
                        if (role && ((role.Name == "k8-master") || (role.Name == "kube-master")) && (keyData[i].K8URL)) {
                            counter++
                            window.open(keyData[i].K8URL)
                            return
                        }

                    })
                }
            }
        }
        if (counter < 1) {
            NotificationManager.error("k8-master or kube-master is necessary to be in roles in order to redirect to dashboard", "node")
        }
    }

    getData() {
        let table = [];
        let kubernetesData = this.state.data;
        Object.keys(kubernetesData).forEach((item, index) => {
            table.push(
                <Media>
                    <Media left >
                        <Label className="marRight10"><h2>{item} </h2></Label>
                    </Media>
                    <Media body></Media>
                    <Media right>
                        <Button className="custBtn" outline color="secondary" onClick={() => (this.openConfirmDeploy())}> Deploy </Button>
                        <Button className="custBtn" outline color="secondary" onClick={() => this.dashboardClick(item)} > Dashboard </Button>
                    </Media>
                </Media>)
            table.push(<br />)
            table.push(
                <Row className="headerRow">
                    <Col sm="1" className="head-name"></Col>
                    <Col sm="2" className="head-name">Name</Col>
                    <Col sm="2" className="head-name">K8S Status</Col>
                    <Col sm="3" className="head-name">Roles</Col>
                    <Col sm="2" className="head-name">Type</Col>
                </Row>
            )
            kubernetesData[item].map((data, i) => {
                let row1 = 'headerRow1'

                if (i % 2 === 0) {
                    row1 = 'headerRow2'
                }
                if (i == kubernetesData[item].length - 1) {
                    row1 = row1 + ' headerRow3 '
                }
                let key = data.name + '_' + index;
                let rolesArr = [];
                //<Col sm="1" className="pad"><Input className="marLeft40" id={key} type="checkbox" onClick={() => (this.checkBoxClick(key))} /></Col>
                data.roles.map((role, j) => {
                    if (j != data.roles.length - 1) {
                        rolesArr.push(role.Name + ', ')
                    }
                    else {
                        rolesArr.push(role.Name)
                    }

                })
                table.push(
                    <Row className={row1}>
                        <Col sm="1" className="pad"><Input className="marLeft40" id={key} type="checkbox" onClick={() => (this.checkBoxClick(key))} /></Col>
                        <Col sm="2" className="pad">{data.Name}</Col>
                        <Col sm="2" className="pad">{data.K8Status}</Col>
                        <Col sm="3" className="pad">{rolesArr}</Col>
                        <Col sm="2" className="pad">{data.type.Name}</Col>
                    </Row>
                )
            })
            table.push(<br />)
        })
        return table;
    }

    checkBoxClick = (rowIndex) => {
        let { selectedRowIndex } = this.state
        let arrayIndex = selectedRowIndex.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndex.splice(arrayIndex, 1)
        } else {
            selectedRowIndex.push(rowIndex)
        }
    }

    deploy() {
        ServerAPI.DefaultServer().kubernetesDeployment();
    }

    openConfirmDeploy() {
        this.setState({ deployModal: true })
    }

    confirmDeploy() {
        if (this.state.deployModal) {
            return (<ConfirmationModal action={this.deploy} actionName={'Deploy'} open={true}></ConfirmationModal>)
        }
    }


    render() {
        return (
            <Container-fluid>
                <Row>
                    <Col sm="12">
                        {this.getData()}
                        {this.confirmDeploy()}
                    </Col>
                </Row>
            </Container-fluid>
        );
    }



}

function mapStateToProps(state) {
    return {
        data: state.kubernetesReducer.get('k8s')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getk8: (url) => dispatch(getk8(url))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Kubernetes);