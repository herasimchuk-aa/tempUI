import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { connectivityHead } from '../../../consts';
import '../../views.css';
import { FETCH_ALL_SITES, FETCH_ALL_ROLES, FETCH_ALL_ISOS, FETCH_ALL_KERNELS, FETCH_ALL_SYSTEM_TYPES, FETCH_ALL_NODES } from '../../../apis/RestConfig';
import { getRequest } from '../../../apis/RestApi';
import SummaryDataTable from '../../Node/NodeSummary/SummaryDataTable';

class ConnectivitySummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {},
            nodes: [],
            constNodes: [],
            connectivityHead: JSON.parse(JSON.stringify(connectivityHead)),
        }
    }

    componentDidMount() {
        this.getAllData()
    }

    getAllData = () => {
        let typeData = []
        let self = this
        let typePromise = getRequest(FETCH_ALL_SYSTEM_TYPES).then(function (json) {
            typeData = json.Data
        })

        let roleData = []
        let rolePromise = getRequest(FETCH_ALL_ROLES).then(function (json) {
            roleData = json.Data
        })

        let kernelData = []
        let kernelPromise = getRequest(FETCH_ALL_KERNELS).then(function (json) {
            kernelData = json.Data
        })

        let isoData = []
        let isoPromise = getRequest(FETCH_ALL_ISOS).then(function (json) {
            isoData = json.Data
        })

        let siteData = []
        let sitePromise = getRequest(FETCH_ALL_SITES).then(function (json) {
            siteData = json.Data
        })

        let nodes = []
        Promise.all([typePromise, rolePromise, kernelPromise, isoPromise, sitePromise]).then(function () {
            getRequest(FETCH_ALL_NODES).then(function (json) {
                nodes = self.convertData(json.Data, typeData, kernelData, isoData, siteData, roleData)
                self.setState({ nodes: nodes, constNodes: Object.assign([], nodes) })
            })
        }).then(function () {
            self.setState({ typedata: typeData, roleData: roleData, kernelData: kernelData, isoData: isoData, siteData: siteData })
        })
    }

    convertData(nodes, types, kernels, isos, sites, roles) {
        nodes.map((node) => {
            types.map((item) => {
                if (item.Id == node.Type_Id) {
                    node.type = item.Name
                }
            })
            kernels.map((item) => {
                if (item.Id == node.Kernel_Id) {
                    node.kernel = item.Name
                }
            })
            isos.map((item) => {
                if (item.Id == node.Iso_Id) {
                    node.iso = item.Name
                }
            })
            sites.map((item) => {
                if (item.Id == node.Site_Id) {
                    node.site = item.Name
                }
            })
            let roleIds = node.roles
            let roleDetails = []

            for (let roleId of roleIds) {
                for (let role of roles) {
                    if (role.Id == roleId) {
                        roleDetails.push(role)
                        break
                    }
                }
            }
            node.roleDetails = roleDetails
        })
        return nodes
    }

    render() {
        return (
            <div>
                <Row className="tableTitle">Connectivity Summary</Row>
                <SummaryDataTable heading={this.state.connectivityHead} data={this.state.nodes} showCheckBox={false} showCollapse={true}></SummaryDataTable>
            </div>
        );
    }

}

export default ConnectivitySummary;
