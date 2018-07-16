import React, { Component } from 'react';
import {tileAppAddress} from '../../../config.js'
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';


class TileApp extends React.Component {

    render(){

        return(
        <div>
            <iframe height="600" width="90%" src={tileAppAddress} ></iframe>
        </div>
        )

        
    }

}

export default TileApp;