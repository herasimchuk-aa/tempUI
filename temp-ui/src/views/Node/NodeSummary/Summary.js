import React, { Component } from 'react';
import { Col, Row, Input, Card ,CardHeader,CardBody ,InputGroup, InputGroupAddon } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import { Redirect } from 'react-router-dom'
import { Button } from 'reactstrap';
import SummaryDataTable from './SummaryDataTable';
import '../../views.css';

class NodeSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            selectedRowIndex: [],
            selectedRows: [],
            redirect: false
        }
    }

    componentDidMount() {
        ServerAPI.DefaultServer().fetchAllServerNodes(this.updateNodeSummary, this);
    }

    updateNodeSummary = (instance, nodes) => {
        instance.setState({
            nodes: nodes,
        });
    }

    checkBoxClick = (rowIndex, singleRowClick) => {
        if (singleRowClick) {
            let { nodes } = this.state
            let selectedRows = [nodes[rowIndex]]
            this.setState({
                selectedRows, redirect: true
            })
            return
        }
        let { selectedRowIndex } = this.state
        let arrayIndex = selectedRowIndex.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndex.splice(arrayIndex, 1)
        } else {
            selectedRowIndex.push(rowIndex)
        }

    }

    onConfigureClick = () => {
        let { nodes, selectedRowIndex } = this.state
        let selectedRows = []
        if (selectedRowIndex.length) {
            selectedRowIndex.map(function (rowIndex) {
                selectedRows.push(nodes[rowIndex])
            })
            this.setState({
                selectedRows, redirect: true
            })
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
                    <div style={{paddingTop:'10px'}}>
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
        if (this.state.redirect) {
            return <Redirect push to={{ pathname: '/node/config', state: this.state.selectedRows }} />
        }
        return (
            <Container-fluid >
                <Row>
                    <Col sm="9">
                        <div className='marginLeft10 '>
                            <Button onClick={() => (this.onConfigureClick())} className="custBtn marginLeft13N" outline color="secondary">Configure</Button>
                            <Button className="custBtn" outline color="secondary">New</Button>
                            <SummaryDataTable nodes={this.state.nodes} checkBoxClick={this.checkBoxClick} />
                        </div>
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
export default NodeSummary;