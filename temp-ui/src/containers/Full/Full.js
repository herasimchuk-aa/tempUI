import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Footer from '../../components/Footer/Footer';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import Dashboard from '../../views/Dashboard/Dashboard';
import Inventory from '../../views/Operation/Inventory/Inventory';
import NodeSummary from '../../views/Node/NodeSummary/Summary';
import NodeOpSummary from '../../views/Node/NodeOpSummary/Summary';
import Roles from '../../views/Node/Roles/Roles';
import Types from '../../views/Node/Types/Types';
import LinuxKernel from '../../views/Node/LinuxKernel/LinuxKernel';
import BaseLinuxIso from '../../views/Node/BaseLinuxIso/BaseLinuxIso';
import BmcMonitor from '../../views/Node/BmcMonitor/BmcMonitor';
import ConnectivitySummary from '../../views/Connectivity/ConnectivitySummary/Summary';
import TileApp from '../../views/Connectivity/TilesApp/TilesApp';
import Site from '../../views/Node/Site/site';
import Cluster from '../../views/Node/Cluster/cluster';
import NodeConfig from '../../views/Node/NodeConfig';
import Kubernetes from '../../views/Kubernetes/Kubernetes';
import LLDP from '../../views/Node/lldp/lldp';
import Goes from '../../views/Node/Goes/Goes';
import EthTool from '../../views/Node/EthTool/EthTool';
import Linux from '../../views/Node/Linux';
import App from '../../views/Node/App';
import User from '../../views/Management/User';
import UserRole from '../../views/Management/UserRole';
import Permission from '../../views/Management/Permission';
import Entity from '../../views/Management/Entity';
import FlowLogs from '../../views/FlowLogs/FlowLogs';

class Full extends Component {
    constructor(props) {
        super(props)
    }

    render() {
         return (
            <div className="app">
                <Header />
                <div className="app-body">
                    <Sidebar {...this.props} />
                    {this.props.location.pathname === '/pcc/dashboard' || this.props.location.pathname === '/pcc/flow-logs' ? (
                        <main className="main" style={{overflow: 'hidden'}}>
                            {this.routes()}
                        </main>
                    ): (
                        <main className="main">
                            <Breadcrumb />
                            <NotificationContainer />
                            <Container fluid>
                                {this.routes()}
                            </Container>
                        </main>
                    )}
                </div>
                <Footer />
            </div>
        );
    }

    routes() {
        return (
            <Switch>
                <Route path="/pcc/flow-logs" name="FlowLogs" component={FlowLogs} />
                <Route path="/pcc/dashboard" name="Dashboard" component={Dashboard} />
                <Route path="/pcc/node/NodeConfigSummary" name="Node-Config" component={NodeSummary} />
                <Route path="/pcc/node/Summary" name="Summary" component={NodeOpSummary} />
                <Route path="/pcc/node/Roles" name="Roles" component={Roles} />
                <Route path="/pcc/node/Types" name="Types" component={Types} />
                <Route path="/pcc/node/Cluster" name="Site" component={Cluster} />
                <Route path="/pcc/node/Site" name="Cluster" component={Site} />
                <Route path="/pcc/node/Linuxkernel" name="Linux Kernel" component={LinuxKernel} />
                <Route path="/pcc/node/Goes" name="Goes" component={Goes} />
                <Route path="/pcc/node/Lldp" name="Lldp" component={LLDP} />
                <Route path="/pcc/node/EthTool" name="ethTool" component={EthTool} />
                <Route path="/pcc/node/BaseLinuxIso" name="Base Linux ISO" component={BaseLinuxIso} />
                <Route path="/pcc/node/linux" name="Linux" component={Linux} />
                <Route path="/pcc/node/apps" name="Apps" component={App} />
                <Route path="/pcc/monitoring/BmcMonitor" name="Summary" component={BmcMonitor} />
                <Route path="/pcc/connectivity/Summary" name="Summary" component={ConnectivitySummary} />
                <Route path="/pcc/monitoring/TilesApp" name="Tiles-App" component={TileApp} />
                <Route path="/pcc/operation/inventory" name="Inventory" component={Inventory} />
                <Route path="/pcc/node/config" name="Monitor" component={NodeConfig} />
                <Route path="/pcc/kubernetes" name="Kubernetes" component={Kubernetes} />
                <Route path="/pcc/node" name="Node" component={NodeSummary} />
                <Route path="/pcc/userManagement/user" name="User" component={User} />
                <Route path="/pcc/userManagement/role" name="UserRole" component={UserRole} />
                <Route path="/pcc/userManagement/permission" name="Permission" component={Permission} />
                <Route path="/pcc/userManagement/entity" name="Entity" component={Entity} />
                <Route path="/pcc/userManagement" name="UserManagement" component={User} />
                <Redirect from="/pcc" to="/pcc/dashboard"></Redirect>
            </Switch>
        );
    }
}

export default Full;
