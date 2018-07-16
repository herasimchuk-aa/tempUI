import React, { Component } from 'react';
import { Row, Col} from 'reactstrap';
import '../../views.css';

class BaseLinuxIso extends Component {

	
	constructor(props){
        super(props)
        this.state = {data:{}}
    }
    drawHeader(){
        return(<Row className="headerRow">
                    <Col sm="1" className="head-name">Name</Col>
                    <Col sm="2" className="head-name">CPU Util%/Max</Col>
                    <Col sm="2" className="head-name">Memory%/Max</Col>
                    <Col sm="2" className="head-name">Storage%/Max</Col>
                    <Col sm="1" className="head-name">PSU1</Col>
                    <Col sm="1" className="head-name">PSU2</Col>
                    <Col sm="1" className="head-name">Fan Speed</Col>
                    <Col sm="2" className="head-name">Alarms</Col>
                </Row>)
    }

    drawtable(){
        return(
                <div>
                    <Row className="headerRow1">
                        <Col sm="1" className="pad">sjc01-pd1-sp01</Col>
                        <Col sm="2" className="pad">12%/4-core</Col>
                        <Col sm="2" className="pad">25%/16GB </Col>
                        <Col sm="2" className="pad">25%/128GB </Col>
                        <Col sm="1" className="pad">12V/21A </Col>
                        <Col sm="1" className="pad">12V/20A </Col>
                        <Col sm="1" className="pad">25% </Col>
                        <Col sm="2" className="pad">fan1 failed </Col>
                    </Row>
                    <Row className="headerRow2">
                        <Col sm="1" className="pad">sjc01-pd1-sv1</Col>
                        <Col sm="2" className="pad">12%/4-core </Col>
                        <Col sm="2" className="pad">25%/128GB </Col>
                        <Col sm="2" className="pad">25%/1TB </Col>
                        <Col sm="1" className="pad">12V/20A </Col>
                        <Col sm="1" className="pad">12V/21A </Col>
                        <Col sm="1" className="pad">28% </Col>
                        <Col sm="2" className="pad">fan1 failed </Col>
                    </Row>
                    <Row className="headerRow1">
                        <Col sm="1" className="pad">sjc01-pd1-sp01</Col>
                        <Col sm="2" className="pad">12%/4-core</Col>
                        <Col sm="2" className="pad">25%/16GB </Col>
                        <Col sm="2" className="pad">25%/128GB </Col>
                        <Col sm="1" className="pad">12V/21A </Col>
                        <Col sm="1" className="pad">12V/20A </Col>
                        <Col sm="1" className="pad">25% </Col>
                        <Col sm="2" className="pad">fan1 failed </Col>
                    </Row>
                    <Row className="headerRow2">
                        <Col sm="1" className="pad">sjc01-pd1-sv1</Col>
                        <Col sm="2" className="pad">12%/4-core </Col>
                        <Col sm="2" className="pad">25%/128GB </Col>
                        <Col sm="2" className="pad">25%/1TB </Col>
                        <Col sm="1" className="pad">12V/20A </Col>
                        <Col sm="1" className="pad">12V/21A </Col>
                        <Col sm="1" className="pad">28% </Col>
                        <Col sm="2" className="pad">fan1 failed </Col>
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

export default BaseLinuxIso;