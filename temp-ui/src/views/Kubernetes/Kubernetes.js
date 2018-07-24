import React, { Component } from 'react';
import { Label, Row, Col, Button, Input, Media,Card ,CardHeader,CardBody,InputGroup,InputGroupAddon } from 'reactstrap';
import '../views.css';
import { data } from './KubernetesData.js';
import {ServerAPI} from '../../ServerAPI';

class Kubernetes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: data,
            selectedRowIndex: []
        }
    }

    componentDidMount(){
        ServerAPI.DefaultServer().fetchAllKubernetes(this.retrieveData,this);
    }

    retrieveData(instance, data) {
        if(data === undefined) {
            alert("No data received");
        }
        else {
                instance.setState({data: data,selectedRowIndex:[]});
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
                        <Button className="custBtn" outline color="secondary" onClick={() => (this.deploy())}> Deploy </Button>
                        <Button className="custBtn" outline color="secondary" > Dashboard </Button>
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
                    row1 =  row1 +' headerRow3 '
                  }
                let key = data.name + '_' + index;
                table.push(
                    <Row className={row1}>
                        <Col sm="1" className="pad"><Input className="marLeft40" id={key} type="checkbox" onClick={() => (this.checkBoxClick(key))} /></Col>
                        <Col sm="2" className="pad">{data.Name}</Col>
                        <Col sm="2" className="pad">{data.K8Status}</Col>
                        <Col sm="3" className="pad">{data.roles+' '}</Col>
                        <Col sm="2" className="pad">{data.type}</Col>
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
        if (this.state.selectedRowIndex.length) {
            alert(this.state.selectedRowIndex + ' deployed')
        }
        else {
            alert("Please make a selection in order to deploy")
        }
    }

    renderFilterComponent = () => {
        let filters = []
        let filterOptions = [
            {
                'id': 'status',
                'displayName': 'Status',
                'options': [
                    {
                        'id': 'active',
                        'displayName': 'Active',
                    },
                    {
                        'id': 'unprovisioned',
                        'displayName': 'Unprovisioned',
                    }
                ]
            }, {
                'id': 'role',
                'displayName': 'Role',
                'options': [
                    {
                        'id': 'Leaf',
                        'displayName': 'Leaf',
                    },
                    {
                        'id': 'Spine',
                        'displayName': 'Spine',
                    },
                    {
                        'id': 'K8Worker',
                        'displayName': 'K8Worker',
                    },
                    {
                        'id': 'etcD',
                        'displayName': 'etcD',
                    },
                    {
                        'id': 'Cache',
                        'displayName': 'Cache',
                    }
                ]
            },
            {
                'id': 'type',
                'displayName': 'Type',
                'options': [
                    {
                        'id': 'PS-3001',
                        'displayName': 'PS-3001',
                    },
                    {
                        'id': 'SuperMicro-x',
                        'displayName': 'SuperMicro-x',
                    }
                ]
            },
            {
                'id': 'site',
                'displayName': 'Site',
                'options': [
                    {
                        'id': 'SJC0',
                        'displayName': 'SJC0',
                    }
                ]
            }
        ]

        filterOptions.map(function (filterOption) {
            let options = filterOption.options
            if (!options || !options.length)
                return null
            filters.push(<div>
                <div className="head-name">{filterOption.displayName}</div>
                <select multiple className="form-control">{options.map(function (option) {
                    return <option value={option.id}>{option.displayName}</option>
                })}</select>
            </div>)
        })

        return (
            <Card className="borRad">
                <CardHeader>Filter</CardHeader>
                <CardBody>
                    {filters}
                    <div style={{ paddingTop: '10px' }}>
                        <Button className="custBtn" outline color="secondary">Apply</Button>
                        <Button className="custBtn" outline color="secondary">Reset</Button>
                    </div>
                </CardBody>
            </Card>
        )
    }

    renderSearchComponent = () => {
        return (
            <Card className="borRad">
                <CardHeader>Search</CardHeader>
                <CardBody>
                    <InputGroup >
                        <Input placeholder="search" className="borRadLeft" />
                        <InputGroupAddon addonType="append" className="borRadRight"></InputGroupAddon>
                    </InputGroup>
                </CardBody>
            </Card>
        )
    }

    render() {
        return (
            <Container-fluid>
                <Row>
                    <Col sm="9">

                        {this.getData()}
                    </Col>
                    <Col sm="3">

                        {this.renderSearchComponent()}
                        {this.renderFilterComponent()}

                    </Col>
                </Row>
            </Container-fluid>
        );
    }



}

export default Kubernetes;