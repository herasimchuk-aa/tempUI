import React, { Component } from 'react';
import Chart from '../../../components/Chart/Chart';
import BarChart from '../../../components/BarChart/BarChart';
import PieChart from '../../../components/PieChart/PieChart';
import { Col, Row } from 'reactstrap';
import { HostStats, Host, ServerAPI } from '../../../ServerAPI';


const StatsCounter = 15;

class Monitor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hostStats: [],
            continueStats: false,
            inventoryReady: false,
        };

        this.fetchStats = this.fetchStats.bind(this);
        this.updateMonitorWithInventory = this.updateMonitorWithInventory.bind(this);
    }

    //componentDidMount() {
    //    ServerAPI.DefaultServer().setupInventory(this.updateMonitorWithInventory, this);
    //}

    componentWillUnmount() {
        this.state.continueStats = false;
    }

    updateMonitorWithInventory(instance) {
        let server = ServerAPI.DefaultServer();
        let stats = [];
        let serverCtr = 0;
        for (serverCtr = 0; serverCtr < StatsCounter; serverCtr++) {
            let s = server.fetchMonitorZeroStates(true);
            stats.push(s);
        }
        //TODO::MN:: Need to calculate this rather then hard coded..
        let serviceCtr = 2;

        instance.setState({
            hostStats: stats,
            continueStats: true,
            inventoryReady: true,
        });
        setTimeout(this.fetchStats, 50, this)
    }

    fetchStats(instance) {
        if (this.state.continueStats) {
            let server = ServerAPI.DefaultServer();
            server.fetchMonitorServerStat(this.updateStats, this);
            setTimeout(instance.fetchStats, 3000, instance)
        }
    }

    updateStats(instance, newStats) {
        if (instance.state.continueStats) {
            let server = ServerAPI.DefaultServer();
            let currStats = instance.state.hostStats;
            for (let ctr = 0; ctr < StatsCounter - 1; ctr++) {
                let next = ctr + 1;
                currStats[ctr] = currStats[next];
            }
            currStats[StatsCounter - 1] = newStats;
            instance.setStatsState(currStats);
        }
    }

    setStatsState(hostStat) {
        this.setState({
            hostStats: hostStat,
        });
    }

    generateDiskPieObject(diskStats, diskLabels) {
        let obj = {
            labels: diskLabels,
            datasets: [{
                label: 'Disk Stats Data',
                data: diskStats,
                backgroundColor: [
                    '#b8c7d5',
                    '#b8cdca',
                    '#dbd9c6',
                    //                    '#e7dae1',
                ]
            }]
        };
        return obj;
    }

    generateCpuMemChartObject(cpuMemLabels, cpuStats, memoryStats) {
        let obj = {
            labels: cpuMemLabels,
            datasets: [{
                label: 'Cpu Stats',
                type: 'line',
                line: {
                    fill: false,
                    lineTension: 0,
                },
                fill: false,
                data: cpuStats,
                borderColor: '#BEBEBE',
                point: {
                    fill: false,
                    radius: 0,
                },
                pointRadius: 0,
                borderColor: '#EC932F',
                backgroundColor: '#EC932F',
                pointBorderColor: '#fff',
                pointBackgroundColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '', //'#EC932F',
                yAxisID: 'y-axis-2',
                lineWidth: 1,
            }, {
                type: 'bar',
                label: 'Memory Stats Data',
                data: memoryStats,
                fill: false,
                backgroundColor: '#71B37C',
                borderColor: '#71B37C',
                hoverBackgroundColor: '#71B37C',
                hoverBorderColor: '#71B37C',
                yAxisID: 'y-axis-1',
            }]
        };
        return obj;
    }

    generateEngixChartObject(labels, totalReqStats, activeConnStats, totalConnStats) {
        let obj = {
            labels: labels,
            datasets: [
                {
                    label: 'Total Requests',
                    type: 'line',
                    line: {
                        fill: false,
                        lineTension: 0,
                    },
                    data: totalReqStats,
                    fill: false,
                    borderColor: '#EC932F',
                    backgroundColor: '#EC932F',
                    pointRadius: 0,
                    pointBorderColor: '#EC932F',
                    pointBackgroundColor: '#EC932F',
                    pointHoverBackgroundColor: '#EC932F',
                    pointHoverBorderColor: '#EC932F',
                    yAxisID: 'y-axis-2'
                },
                {
                    type: 'line',
                    label: 'Active Connection',
                    data: activeConnStats,
                    line: {
                        fill: false,
                        lineTension: 0,
                    },
                    fill: false,
                    pointRadius: 0,
                    backgroundColor: '#71B37C',
                    borderColor: '#71B37C',
                    hoverBackgroundColor: '#71B37C',
                    hoverBorderColor: '#71B37C',
                    yAxisID: 'y-axis-1'
                },
                {
                    type: 'line',
                    label: 'Total Connection',
                    data: totalConnStats,
                    fill: false,
                    line: {
                        fill: false,
                        lineTension: 0,
                    },
                    pointRadius: 0,
                    backgroundColor: '#b8c7d5',
                    borderColor: '#b8cdca',
                    hoverBackgroundColor: '#dbd9c6',
                    hoverBorderColor: '#e7dae1',
                    yAxisID: 'y-axis-1'
                }
            ]
        };
        return obj;
    }

    generateVarnishChartObject(labels, totalReqStats, cacheHitsStats, cacheMissStats) {
        let obj = {
            labels: labels,
            datasets: [{
                label: 'Client Requests',
                type: 'line',
                data: totalReqStats,
                fill: false,
                borderColor: '#EC932F',
                backgroundColor: '#EC932F',
                pointRadius: 0,
                pointBorderColor: '#EC932F',
                pointBackgroundColor: '#EC932F',
                pointHoverBackgroundColor: '#EC932F',
                pointHoverBorderColor: '#EC932F',
                yAxisID: 'y-axis-2'
            }, {
                type: 'line',
                label: 'Cache Hits',
                data: cacheHitsStats,
                fill: false,
                pointRadius: 0,
                backgroundColor: '#71B37C',
                borderColor: '#71B37C',
                hoverBackgroundColor: '#71B37C',
                hoverBorderColor: '#71B37C',
                yAxisID: 'y-axis-1'
            }, {
                type: 'line',
                label: 'Cache Misses',
                data: cacheMissStats,
                fill: false,
                pointRadius: 0,
                backgroundColor: '#b8c7d5',
                borderColor: '#b8cdca',
                hoverBackgroundColor: '#dbd9c6',
                hoverBorderColor: '#e7dae1',
                yAxisID: 'y-axis-1'
            }]
        };
        return obj;
    }

    selectEginxStats(event, hostStats, nginxObj) {
        alert("ENGIN Selected " + host.hName);
    }

    //
    renderHost(hostStat, diskPieObj, cpuMemObj, varnishObj, nginxObj) {
        let rowId = hostStat.hName + "_id";
        let isServer = (hostStat.hostType === Host.SERVER);
        return (
            <Row id={rowId} key={rowId} className="show-grid">
                <Col xs={12} md={2} className="borderTop">
                    <h6>Host: {hostStat.hName}</h6>
                    IP: {hostStat.IPAddress}<br />
                    Invader Port: {hostStat.invPort}<br />
                </Col>
                <Col xs={12} md={4} className="borderAllSide">
                    <Row>
                        <Col xs={12} md={9}><BarChart barChartData={cpuMemObj} /></Col>
                        <Col xs={12} md={3}><PieChart pieChartData={diskPieObj} /></Col>
                    </Row>
                </Col>
                <Col xs={12} md={3} className="borderAllSide"><Chart lineChartData={varnishObj} /></Col>
                <Col xs={12} md={3} className="borderTop"><Chart onClick={(event) => this.selectEginxStats(event, hostStats, nginxObj)} lineChartData={nginxObj} /></Col>
            </Row>
        );
    }

    renderAllHostsAndServices() {
        let retHTML = [];
        let labels = [];

        let diskStatLabel = [];
        let invaderCpu = [];
        let invaderMem = [];
        let invaderDisk = [];
        let invaderVarnishClientReq = [];
        let invaderVarnishCacheHits = [];
        let invaderVarnishCacheMiss = [];
        let invaderNGINXTotalReq = [];
        let invaderNGINXActConn = [];
        let invaderNGINXTotalConn = [];

        let serverCpu = {};
        let serverMem = {};
        let serverDisk = {};
        let serverVarnishClientReq = {};
        let serverVarnishCacheHits = {};
        let serverVarnishCacheMiss = {};
        let serverNGINXTotalReq = {};
        let serverNGINXActConn = {};
        let serverNGINXTotalConn = {};

        let invaderStat = undefined;
        // Generate Time Labels.

        let monitoredServers = {};
        for (let ctr = 0; ctr < StatsCounter; ctr++) {
            let monitorStat = this.state.hostStats[ctr];
            labels.push(monitorStat.timeLabel);

            invaderStat = monitorStat.invaderStats;
            invaderDisk = invaderStat.diskStats();  // effect of doing this is we pickup last stats in the array.
            diskStatLabel = invaderStat.diskStatsLabels();
            invaderCpu[ctr] = invaderStat.cpuStatsFunc();
            invaderMem[ctr] = invaderStat.memoryStatsFunc();
            let varnishStats = invaderStat.varnishStats();
            invaderVarnishClientReq[ctr] = varnishStats[0];
            invaderVarnishCacheHits[ctr] = varnishStats[1];
            invaderVarnishCacheMiss[ctr] = varnishStats[2];

            let enginxStats = invaderStat.enginxStats();
            invaderNGINXTotalReq[ctr] = enginxStats[0];
            invaderNGINXActConn[ctr] = enginxStats[1];
            invaderNGINXTotalConn[ctr] = enginxStats[2];

            for (let hostName in monitorStat.hostsStats) {
                let hostStats = monitorStat.hostsStats[hostName];
                if (!serverCpu[hostName]) {
                    monitoredServers[hostName] = hostStats;
                    serverCpu[hostName] = [];
                    serverMem[hostName] = [];
                    serverDisk[hostName] = [];
                    serverVarnishClientReq[hostName] = [];
                    serverVarnishCacheHits[hostName] = [];
                    serverVarnishCacheMiss[hostName] = [];
                    serverNGINXTotalReq[hostName] = [];
                    serverNGINXActConn[hostName] = [];
                    serverNGINXTotalConn[hostName] = [];
                }
                serverCpu[hostName][ctr] = hostStats.cpuStatsFunc();
                serverMem[hostName][ctr] = hostStats.memoryStatsFunc();
                serverDisk[hostName] = hostStats.diskStats();
                let varnishStats = hostStats.varnishStats();
                serverVarnishClientReq[hostName][ctr] = varnishStats[0];
                serverVarnishCacheHits[hostName][ctr] = varnishStats[1];
                serverVarnishCacheMiss[hostName][ctr] = varnishStats[2];

                let sNginxStats = hostStats.enginxStats();
                serverNGINXTotalReq[hostName][ctr] = sNginxStats[0];
                serverNGINXActConn[hostName][ctr] = sNginxStats[1];
                serverNGINXTotalConn[hostName][ctr] = sNginxStats[2];
            }
        }

        let diskPieObj = this.generateDiskPieObject(invaderDisk, diskStatLabel);
        let cpuMemObj = this.generateCpuMemChartObject(labels, invaderCpu, invaderMem);
        let varnishObj = this.generateVarnishChartObject(labels, invaderVarnishClientReq, invaderVarnishCacheHits, invaderVarnishCacheMiss);
        let engixObj = this.generateEngixChartObject(labels, invaderNGINXTotalReq, invaderNGINXActConn, invaderNGINXTotalConn);
        retHTML.push(this.renderHost(invaderStat, diskPieObj, cpuMemObj, varnishObj, engixObj));

        for (let hostName in monitoredServers) {
            let hostStats = monitoredServers[hostName]
            let sDiskPieObj = this.generateDiskPieObject(serverDisk[hostName], diskStatLabel);
            let sCpuMemObj = this.generateCpuMemChartObject(labels, serverCpu[hostName], serverMem[hostName]);
            let sVarnishObj = this.generateVarnishChartObject(labels, serverVarnishClientReq[hostName], serverVarnishCacheHits[hostName], serverVarnishCacheMiss[hostName]);
            let sEngixObj = this.generateEngixChartObject(labels, serverNGINXTotalReq[hostName], serverNGINXActConn[hostName], serverNGINXTotalConn[hostName]);
            retHTML.push(this.renderHost(hostStats, sDiskPieObj, sCpuMemObj, sVarnishObj, sEngixObj));
        }
        return retHTML;
    }

    render() {
        let x = 10;
        let editable = false;
        return (
            <SpreadSheet columns={x} rows={x} editable={editable}></SpreadSheet>
        );
        //if (!this.state.inventoryReady) {
        //    return <div>Loading.....</div>
        //}
        //return (
        //    <div>
        //        <Row>
        //            <Col xs={12}>
        //                <strong className="fontBig">Service</strong>
        //            </Col>
        //        </Row>
        //        <Grid>
        //            <Row className="show-grid">
        //                <Col xs={12} md={2}>
        //                </Col>
        //                <Col xs={12} md={4} className="borderLeft">
        //                    <h5>System</h5>
        //                </Col>
        //                <Col xs={12} md={3} className="borderLeft">
        //                    <h5>Varnish[:80]</h5>
        //                </Col>
        //                <Col xs={12} md={3} className="borderLeft">
        //                    <h5>Nginx[:443]</h5>
        //                </Col>
        //            </Row>
        //            {this.renderAllHostsAndServices()}
        //        </Grid>
        //    </div>
        //);
    }
}

export default Monitor;
