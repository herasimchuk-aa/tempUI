import React, { Component } from 'react';
import { Button, CardHeader, CardBody, Input } from 'reactstrap';
import { GRAPH_DASHBOARD } from "../../apis/RestConfig";
import '../../views/views.css'


class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ipAddress: Window.invaderServerAddress,
        };
    }

    componentDidMount() {
        //let server = ServerAPI.DefaultServer();
        //server.setupInventory(this.inventoryCallback, this);
    }

    onIPSubmit() {
        if (!this.state.ipAddress) {
            alert("Enter an IP")
            return
        }
        console.log(this.state.ipAddress);
        Window.invaderServerAddress = this.state.ipAddress;
    }

    onIPChange(event) {
        this.setState({
            ipAddress: event.target.value,
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
                <Input type="text" placeholder="Key" required defaultValue={this.state.ipAddress} onChange={(event) => this.onIPChange(event)} />
                <Button className="custBtn animated fadeIn floatRight marTop10" outline color="secondary" onClick={() => this.onIPSubmit()}>Save</Button>
            </CardBody>
        );
        return retHTML;
    }

    render() {
        let dashboardUrl = Window.graphGuiIP+GRAPH_DASHBOARD
        return (
            <iframe
                src={dashboardUrl}
                style={{ height: '100%', width: '100%'}}
                frameBorder="0"
            />
        )
    }
}

export default Dashboard;
