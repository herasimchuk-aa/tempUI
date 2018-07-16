import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import '../../views.css';

class ConnectivitySummary extends React.Component {

    constructor(props){
        super(props)
        this.state = {data:{}}
    }

    drawHeader(){
        return(<Row className="headerRow">
                    <Col sm="1" className="head-name">Name</Col>
                    <Col sm="1" className="head-name">Status</Col>
                    <Col sm="1" className="head-name">Roles</Col>
                    <Col sm="1" className="head-name">Type</Col>
                    <Col sm="1" className="head-name">Interfaces</Col>
                    <Col sm="1" className="head-name">IP Address</Col>
                    <Col sm="2" className="head-name">Connected To</Col>
                    <Col sm="1" className="head-name">Admin</Col>
                    <Col sm="1" className="head-name">Link</Col>
                    <Col sm="1" className="head-name">LLDP matched</Col>
                    <Col sm="1" className="head-name">Interfaces Alarms</Col>
                </Row>)
    }

    drawtable(){
        return(
            <div>
                <Row className="headerRow1">
                    <Col sm="1" className="pad">sjc01-pd1-sp01</Col>
                    <Col sm="1" className="pad">Active</Col>
                    <Col sm="1" className="pad">Spine, K8Worker, etcD</Col>
                    <Col sm="1" className="pad">PS-3001</Col>
                    <Col sm="1" className="pad">
                        <ListGroup>
                            <ListGroupItem>
                                etho
                            </ListGroupItem>
                            <ListGroupItem>
                                eth-1-1
                            </ListGroupItem>
                            <ListGroupItem>
                                eth-17-1
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                172.17.2.52
                            </ListGroupItem>
                            <ListGroupItem>
                                172.17.2.52
                            </ListGroupItem>
                            <ListGroupItem>
                                172.17.2.52
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="2" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                            mgmt vlan
                            </ListGroupItem>
                            <ListGroupItem>
                            sjc01-pd1-lf01:eth-1-1
                            </ListGroupItem>
                            <ListGroupItem>
                            sjc01-pd1-lf01:eth-17-1
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                         <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    
                </Row>
                <Row className="headerRow2 headerRow3">
                    <Col sm="1" className="pad">sjc01-pd1-sp01</Col>
                    <Col sm="1" className="pad">Active</Col>
                    <Col sm="1" className="pad">Spine, K8Worker, etcD</Col>
                    <Col sm="1" className="pad">PS-3001</Col>
                    <Col sm="1" className="pad">
                        <ListGroup>
                            <ListGroupItem>
                                etho
                            </ListGroupItem>
                            <ListGroupItem>
                                eth-1-1
                            </ListGroupItem>
                            <ListGroupItem>
                                eth-17-1
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                172.17.2.52
                            </ListGroupItem>
                            <ListGroupItem>
                                172.17.2.52
                            </ListGroupItem>
                            <ListGroupItem>
                                172.17.2.52
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="2" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                            mgmt vlan
                            </ListGroupItem>
                            <ListGroupItem>
                            sjc01-pd1-lf01:eth-1-1
                            </ListGroupItem>
                            <ListGroupItem>
                            sjc01-pd1-lf01:eth-17-1
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                         <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                            <ListGroupItem>
                                Up
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col sm="1" className="pad">
                         <ListGroup>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                            <ListGroupItem>
                                Yes
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    
                </Row>
               
            </div>    )
    }

    render() {
        let tableHeader = this.drawHeader()
        let table = this.drawtable()
        return (
           <div>
                {tableHeader}
                { table}
            </div> 
        );
    }

}

export default ConnectivitySummary;
