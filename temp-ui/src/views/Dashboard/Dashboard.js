import React, { Component } from 'react';
import { ServerAPI } from '../../ServerAPI';
import {
    Row,
    Col,
    Badge,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Collapse,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Table
} from 'reactstrap';


class Dashboard extends Component {

    constructor(props) {
        super(props);
        let ipAddress = ServerAPI.DefaultServer().DefaultInvader();

        this.state = {
            defaultIPAddress: ipAddress,
            unsubmittedIPAddress: "",
        };
    }

    componentDidMount() {
        //let server = ServerAPI.DefaultServer();
        //server.setupInventory(this.inventoryCallback, this);
    }

    onIPSubmit(event) {
        console.log(this.state.unsubmittedIPAddress);
        ServerAPI.DefaultServer().updateInvaderAddress(this.state.unsubmittedIPAddress);
    }

    onIPChange(event) {
        this.setState({
            unsubmittedIPAddress: event.target.value,
        });
    }

    renderInvaderIP() {
        let retHTML = [];
        retHTML.push(
            <CardHeader id="invader_ip" key="invader_ip">
                <h5>Default Server</h5>
            </CardHeader>
        );
        retHTML.push(
            <CardBody id="invader_ip_text" key="invader_ip_text">
                <Input type="text" placeholder="Key" required defaultValue={this.state.defaultIPAddress} onChange={(event) => this.onIPChange(event)} />
                <Button className="floatRight" color="link" size="lg" onClick={(event) => this.onIPSubmit(event)}> Save </Button>
            </CardBody>
        );
        return retHTML;
    }

    render() {
        return (
            <div className="animated fadeIn">
                {this.renderInvaderIP()}
            </div>
        )
    }
}

export default Dashboard;
