import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Footer from '../../components/Footer/Footer';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Dashboard from '../../views/Dashboard/Dashboard';
import Inventory from '../../views/Operation/Inventory/Inventory';
import Monitor from '../../views/Operation/Monitor/Monitor';
import Playbook from '../../views/Operation/Playbook/Playbook';
import NodeSummary from '../../views/Node/NodeSummary/Summary';
import NodeOpSummary from '../../views/Node/NodeOpSummary/Summary';
import Roles from '../../views/Node/Roles/Roles';
import Types from '../../views/Node/Types/Types';
import LinuxKernel from '../../views/Node/LinuxKernel/LinuxKernel';
import BaseLinuxIso from '../../views/Node/BaseLinuxIso/BaseLinuxIso';
import BmcMonitor from '../../views/Node/BmcMonitor/BmcMonitor';
import ConnectivitySummary from '../../views/Connectivity/ConnectivitySummary/Summary';
import TileApp from '../../views/Connectivity/TilesApp/TilesApp';
// import Site from '../../views/Node/Site/site';
import NodeConfig from '../../views/Node/NodeConfig';
import Kubernetes from '../../views/Kubernetes/Kubernetes'


class Full extends Component {
    render() {
        return (
            <div className="app">
                <Header />
                <div className="app-body">
                    <Sidebar {...this.props} />
                    <main className="main">
                        <Breadcrumb />
                        <NotificationContainer />
                        <Container fluid>
                            <Switch>
                                <Route path="/dashboard" name="Dashboard" component={Dashboard} />
                                <Route path="/node/NodeConfigSummary" name="Node-Config" component={NodeSummary} />
                                <Route path="/node/Summary" name="Summary" component={NodeOpSummary} />
                                <Route path="/node/Roles" name="Roles" component={Roles} />
                                <Route path="/node/Types" name="Types" component={Types} />
                                {/* <Route path="/node/Site" name="Site" component={Site}/> */}
                                <Route path="/node/Linuxkernel" name="Linux Kernel" component={LinuxKernel} />
                                <Route path="/node/BaseLinuxIso" name="Base Linux ISO" component={BaseLinuxIso} />
                                <Route path="/monitoring/BmcMonitor" name="Summary" component={BmcMonitor} />
                                <Route path="/connectivity/Summary" name="Summary" component={ConnectivitySummary} />
                                <Route path="/monitoring/TilesApp" name="Tiles-App" component={TileApp} />
                                <Route path="/operation/inventory" name="Inventory" component={Inventory} />
                                <Route path="/operation/playbook" name="Playbook" component={Playbook} />
                                <Route path="/node/config" name="Monitor" component={NodeConfig} />
                                <Route path="/kubernetes" name="Kubernetes" component={Kubernetes} />
                                <Route path="/node" name="Node" component={NodeSummary} />
                                <Redirect from="/" to="/dashboard" />
                            </Switch>
                        </Container>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Full;
