import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { ServerAPI } from '../../../ServerAPI';
import '../../views.css';

class ConnectivitySummary extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data:{},
            nodes: []
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

    drawHeader(){
        return(<Row className="headerRow">
                    <Col sm="1" className="head-name">Name</Col>
                    <Col sm="1" className="head-name">Status</Col>
                    <Col sm="1" className="head-name">Roles</Col>
                    <Col sm="1" className="head-name">Type</Col>
                    <Col sm="1" className="head-name" style={{textAlign:"center"}}>Interfaces</Col>
                    <Col sm="1" className="head-name" style={{textAlign:"center"}}>IP Address</Col>
                    <Col sm="2" className="head-name" style={{textAlign:"center"}}>Connected To</Col>
                    <Col sm="1" className="head-name">Admin</Col>
                    <Col sm="1" className="head-name">Link</Col>
                    <Col sm="1" className="head-name">LLDP matched</Col>
                    <Col sm="1" className="head-name">Interfaces Alarms</Col>
                </Row>)
    }

    drawtable(){
        let data = this.state.nodes
        console.log(data)
        let rows = []
        let header = this.drawHeader()
        rows.push(header)
        if(data && data.length){
            let nodes = data;
            nodes.map( (node,i) => {
               let row1 = 'headerRow1'

               if(i%2 === 0){
                   row1 = 'headerRow2'
               }
               if (i == nodes.length - 1) {
                   row1 =  row1 +' headerRow3 '
               }
               let allInterfaces = node.allInterfaces
               let allIntfDiv = "-"
               let allIntIPDiv = "-"
               let allIntConnDiv = "-"
               let allLinkDiv = "-"
               let allLldpMatchDiv = "-"
               let allAlarmDiv = "-"
               let allAdminDiv = "-"
               if(allInterfaces && allInterfaces.length){
                    allIntfDiv = allInterfaces.map( (interfaceItem) => { return (
                        <ListGroup><ListGroupItem>{ interfaceItem.port ? interfaceItem.port : '-'}</ListGroupItem></ListGroup> 
                        )})
                    allIntIPDiv = allInterfaces.map( (interfaceItem) => { return (
                        <ListGroup><ListGroupItem>{ interfaceItem.IPAddress ? interfaceItem.IPAddress : '-'}</ListGroupItem></ListGroup> 
                    )})
                    allAdminDiv = allInterfaces.map( (interfaceItem) => { return (
                        <ListGroup><ListGroupItem>{ interfaceItem.admin ? interfaceItem.admin : '-'}</ListGroupItem></ListGroup> 
                    )})
                    allAlarmDiv = allInterfaces.map( (interfaceItem) => { return (

                        <ListGroup><ListGroupItem>{ interfaceItem.alarms ? interfaceItem.alarms : '-'}</ListGroupItem></ListGroup> 
                    )})
                    allIntConnDiv = allInterfaces.map( (interfaceItem) => { return (
                        <ListGroup><ListGroupItem>{ interfaceItem.connectedTo.serverName && interfaceItem.connectedTo.serverPort ? interfaceItem.connectedTo.serverName+' : '+interfaceItem.connectedTo.serverPort  : '-'}</ListGroupItem></ListGroup> 
                    )})
                    allLinkDiv = allInterfaces.map( (interfaceItem) => { return (
                        <ListGroup><ListGroupItem>{ interfaceItem.connectedTo.link ? interfaceItem.connectedTo.link  : '-'}</ListGroupItem></ListGroup> 
                    )})
                    allLldpMatchDiv = allInterfaces.map( (interfaceItem) => { return (
                        <ListGroup><ListGroupItem>{ interfaceItem.connectedTo.lldpMatched ? interfaceItem.connectedTo.lldpMatched  : '-'}</ListGroupItem></ListGroup> 
                    )})
               }
               let row  =  ( <Row className={row1}>
                    <Col sm="1" className="pad">{node.name ? node.name : '-'}</Col>
                    <Col sm="1" className="pad">{node.status ? node.status : '-'}</Col>
                    <Col sm="1" className="pad">{node.role ? node.role : '-' }</Col>
                    <Col sm="1" className="pad">{node.nodeType ? node.nodeType : '-'}</Col>
                    <Col sm="1" className="pad" style={{textAlign:"center"}}>
                        {allIntfDiv}
                    </Col>
                    <Col sm="1" className="pad" style={{textAlign:"center"}}>
                        {allIntIPDiv}
                    </Col>
                    <Col sm="2" className="pad" style={{textAlign:"center"}}>
                        {allIntConnDiv}
                    </Col>
                    <Col sm="1" className="pad">{allAdminDiv}</Col>
                    <Col sm="1" className="pad">{allLinkDiv}</Col>
                    <Col sm="1" className="pad">{allLldpMatchDiv}</Col>
                    <Col sm="1" className="pad">{allAlarmDiv}</Col>
                   </Row>)
               rows.push(row)
            
           } )  
       }
       return rows
    }

    render() {
        let table = this.drawtable()
        return (
           <div>
                { table}
            </div> 
        );
    }

}

export default ConnectivitySummary;
