import I from 'immutable'
import { getRequest, putRequest, postRequest } from '../apis/RestApi';
import {
    FETCH_ALL_SYSTEM_TYPES, FETCH_ALL_ROLES, FETCH_ALL_KERNELS, FETCH_ALL_ISOS, FETCH_ALL_SITES,
    GET_PROVISION, FETCH_ALL_GOES, FETCH_ALL_LLDP, FETCH_ALL_ETHTOOL, FETCH_ALL_IPROUTE, FETCH_ALL_FRR, FETCH_ALL_CLUSTERS
} from '../apis/RestConfig';
import { fetchTypes } from './systemTypeAction';
import { fetchRoles } from './roleAction';
import { fetchKernels } from './kernelAction';
import { getISOs } from './baseIsoActions';
import { getSites } from './siteAction';
import { getGoes } from './goesAction';
import { getLLDP } from './lldpAction';
import { getEthTool } from './ethToolAction';
import { getIpRoute } from './ipRouteAction';
import { getFrr } from './frrAction';
import { getClusters } from './clusterAction';
export const fetchNodes = (url) => (dispatch, getState) => {
    return getRequest(url).then(function (nodeData) {
        let typePromise = dispatch(fetchTypes(FETCH_ALL_SYSTEM_TYPES))
        let rolePromise = dispatch(fetchRoles(FETCH_ALL_ROLES))
        let kernelPromise = dispatch(fetchKernels(FETCH_ALL_KERNELS))
        let isoPromise = dispatch(getISOs(FETCH_ALL_ISOS))
        let sitePromise = dispatch(getSites(FETCH_ALL_SITES))
        let clusterPromise = dispatch(getClusters(FETCH_ALL_CLUSTERS))
        let goesPromise = dispatch(getGoes(FETCH_ALL_GOES))
        let lldpPromise = dispatch(getLLDP(FETCH_ALL_LLDP))
        let ethToolPromise = dispatch(getEthTool(FETCH_ALL_ETHTOOL))
        let ipRoutePromise = dispatch(getIpRoute(FETCH_ALL_IPROUTE))
        let frrPromise = dispatch(getFrr(FETCH_ALL_FRR))
        return Promise.all([typePromise, rolePromise, kernelPromise, isoPromise, sitePromise, goesPromise, lldpPromise, ethToolPromise, ipRoutePromise, frrPromise, clusterPromise]).then(function () {
            let store = getState()
            let nodes = convertData(nodeData.Data, store)
            //temp code . remove it 
            let provisionPromises = []
            if (nodes && nodes.length) {
                nodes.map(function (node) {
                    let executionId = node.ExecId
                    if (executionId) {
                        let provisionUrl = GET_PROVISION + executionId
                        provisionPromises.push(getRequest(provisionUrl).then(function (json) {
                            node.executionStatusObj = json
                        }))
                    }
                })
            }
            return Promise.all(provisionPromises).then(function () {
                return dispatch(setNodes(I.fromJS(nodes)))
            })
        })
    })
}


export const updateNode = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (updatedNodeData) {
        let store = getState()
        let storedNodes = store.nodeReducer.get('nodes')
        storedNodes = storedNodes.map(function (node) {
            if (node.get('Id') === updatedNodeData.Data.Id) {
                let types = store.systemTypeReducer.getIn(['types'])
                let kernels = store.kernelReducer.getIn(['kernels'])
                let isos = store.baseISOReducer.getIn(['isos'])
                let sites = store.siteReducer.getIn(['sites'])
                let clusters = store.clusterReducer.getIn(['clusters'])
                let roles = store.roleReducer.getIn(['roles'])
                let goesList = store.goesReducer.getIn(['goes'])
                let lldps = store.lldpReducer.getIn(['lldps'])
                let ethTools = store.ethToolReducer.getIn(['ethTools'])
                let ipRoutes = store.ipRouteReducer.getIn(['ipRoutes'])
                let frr = store.frrReducer.getIn(['frr'])
                let updatedNode = convertNode(updatedNodeData.Data, types, kernels, isos, sites, roles, goesList, lldps, ethTools, ipRoutes, frr, clusters)
                node = I.fromJS(updatedNode)
            }
            return node
        })
        return dispatch(setNodes(I.fromJS(storedNodes)))
    })
}

export const addNode = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedNodes = store.nodeReducer.get('nodes', I.List())
            let types = store.systemTypeReducer.getIn(['types'])
            let kernels = store.kernelReducer.getIn(['kernels'])
            let isos = store.baseISOReducer.getIn(['isos'])
            let sites = store.siteReducer.getIn(['sites'])
            let clusters = store.clusterReducer.getIn(['clusters'])
            let roles = store.roleReducer.getIn(['roles'])
            let goesList = store.goesReducer.getIn(['goes'])
            let lldps = store.lldpReducer.getIn(['lldps'])
            let ethTools = store.ethToolReducer.getIn(['ethTools'])
            let ipRoutes = store.ipRouteReducer.getIn(['ipRoutes'])
            let frr = store.frrReducer.getIn(['frr'])
            let convertedNode = convertNode(json.Data, types, kernels, isos, sites, roles, goesList, lldps, ethTools, ipRoutes, frr, clusters)
            storedNodes = storedNodes.push(I.fromJS(convertedNode))
            return dispatch(setNodes(storedNodes))
        }
        throw new Error(json.Message)
    })
}


export const deleteNodes = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedNodes = store.nodeReducer.get('nodes')

            for (let node of storedNodes) {
                if (params.indexOf(node.get('Id')) > -1) {
                    storedNodes = storedNodes.deleteIn([storedNodes.indexOf(node)])
                    break
                }
            }
            return dispatch(setNodes(storedNodes))
        }
        throw new Error(json.Message)
    })
}

export const provisionNode = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (provisionData) {
        let store = getState()
        let storedNodes = store.nodeReducer.get('nodes')
        storedNodes = storedNodes.map(function (node) {
            if (node.get('Id') === provisionData.Data.NodeId) {
                node = node.set('executionStatusObj', I.fromJS(provisionData.Data))
            }
            return node
        })
        return dispatch(setNodes(storedNodes))
    })
}

export const rollbackProvision = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (provisionData) {
        let store = getState()
        let storedNodes = store.nodeReducer.get('nodes')
        storedNodes = storedNodes.map(function (node) {
            if (node.get('Id') === provisionData.Data.NodeId) {
                node = node.set('executionStatusObj', I.fromJS(provisionData.Data))
            }
            return node
        })
        return dispatch(setNodes(storedNodes))
    })
}

export const fetchActualNode = (url, nodeId) => (dispatch, getState) => {
    let node = {
        'Id': nodeId
    }
    return postRequest(url, node)
        .then(function (data) {
            return dispatch(setActualNodeInfo(I.fromJS(data.Data)))
        });
}

export const SET_ACTUAL_NODE_INFO = 'SET_ACTUAL_NODE_INFO'
export function setActualNodeInfo(payload) {
    return {
        type: SET_ACTUAL_NODE_INFO,
        payload: payload
    }
}

export const SET_NODE_HEADING = 'SET_NODE_HEADING'
export function setNodeHeadings(payload) {
    return {
        type: SET_NODE_HEADING,
        payload: payload
    }
}

export const SET_CONNECTIVITY_HEADING = 'SET_CONNECTIVITY_HEADING'
export function setConnectivityHeadings(payload) {
    return {
        type: SET_CONNECTIVITY_HEADING,
        payload: payload
    }
}

export const SET_NODES = 'SET_NODES'
export function setNodes(payload) {
    return {
        type: SET_NODES,
        payload: payload
    }
}

export const SET_SELECTED_NODE_IDS = 'SET_SELECTED_NODE_IDS'
export function setSelectedNodeIds(payload) {
    return {
        type: SET_SELECTED_NODE_IDS,
        payload: payload
    }
}

function convertData(nodes, store) {
    let types = store.systemTypeReducer.getIn(['types'])
    let kernels = store.kernelReducer.getIn(['kernels'])
    let isos = store.baseISOReducer.getIn(['isos'])
    let sites = store.siteReducer.getIn(['sites'])
    let clusters = store.clusterReducer.getIn(['clusters'])
    let roles = store.roleReducer.getIn(['roles'])
    let goesList = store.goesReducer.getIn(['goes'])
    let lldps = store.lldpReducer.getIn(['lldps'])
    let ethTools = store.ethToolReducer.getIn(['ethTools'])
    let ipRoutes = store.ipRouteReducer.getIn(['ipRoutes'])
    let frr = store.frrReducer.getIn(['frr'])

    if (nodes && nodes.length) {
        nodes.map((node) => {
            return convertNode(node, types, kernels, isos, sites, roles, goesList, lldps, ethTools, ipRoutes, frr, clusters)
        })
        return nodes
    }
    return []
}

function convertNode(node, types, kernels, isos, sites, roles, goes, lldps, ethTools, ipRoutes, frr, clusters) {
    types.map((item) => {
        if (item.get('Id') == node.Type_Id) {
            node.Type = item.get('Name')
        }
    })
    kernels.map((item) => {
        if (item.get('Id') == node.Kernel_Id) {
            node.Kernel = item.get('Name')
            node.kernelVersion = item.get('Version')
        }
    })
    isos.map((item) => {
        if (item.get('Id') == node.Iso_Id) {
            node.BaseISO = item.get('Name')
        }
    })
    sites.map((item) => {
        if (item.get('Id') == node.Site_Id) {
            node.site = item.get('Name')
        }
    })
    let roleIds = node.roles
    let roleDetails = []

    for (let roleId of roleIds) {
        for (let role of roles) {
            if (role.get('Id') == roleId) {
                roleDetails.push(role.toJS())
                break
            }
        }
    }
    node.roleDetails = roleDetails

    goes.map((item) => {
        if (item.get('Id') == node.Goes_Id) {
            // node.goesVersion = item.get('Version')
            node.goes = Object.assign({}, item.toJS())
        }
    })
    lldps.map((item) => {
        if (item.get('Id') == node.Lldp_Id) {
            node.lldp = Object.assign({}, item.toJS())
        }
    })
    ethTools.map((item) => {
        if (item.get('Id') == node.Ethtool_Id) {
            node.ethTool = Object.assign({}, item.toJS())
        }
    })
    ipRoutes.map((item) => {
        if (item.get('Id') == node.Iproute_Id) {
            node.ipRoute = Object.assign({}, item.toJS())
        }
    })
    frr.map((item) => {
        if (item.get('Id') == node.Frr_Id) {
            node.frr = Object.assign({}, item.toJS())
        }
    })
    clusters.map((item) => {
        if (item.get('Id') == node.ClusterId) {
            node.clusterName = item.get('Name')
        }
    })
    return node
}
