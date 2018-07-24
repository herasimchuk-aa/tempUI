import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import '../../views.css';

class Site extends React.Component {

    constructor(props) {
        super(props)
    }

    drawtable() {
        return (
            <div>
                <Row className="headerRow">
                    <Col sm="6" className="head-name">Name</Col>
                    <Col sm="6" className="head-name">Description</Col>
                </Row>
                <Row className="headerRow2">
                    <Col sm="6" className="pad">site name</Col>
                    <Col sm="6" className="pad">site description</Col>
                </Row>
                <Row className="headerRow1 headerRow3">
                    <Col sm="6" className="pad">site name</Col>
                    <Col sm="6" className="pad">site description</Col>
                </Row>
            </div>
        )
    }

    render() {
        let table = this.drawtable()

        return (
            <div>
                {table}
            </div>
        );
    }

}

export default Site;
