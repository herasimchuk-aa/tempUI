import I from 'immutable'
import { getRequest } from '../apis/RestApi';
import { FETCH_ALL_NODES, FETCH_ALL_SYSTEM_TYPES, FETCH_ALL_ROLES, FETCH_ALL_KERNELS, FETCH_ALL_ISOS, FETCH_ALL_SITES, GET_PROVISION } from '../apis/RestConfig';
import { fetchTypes } from './systemTypeAction';
import { fetchRoles } from './roleAction';
import { fetchKernels } from './kernelAction';
import { getISOs } from './baseIsoActions';
import { getSites } from './siteAction';
export const fetchNodes = (url) => (dispatch, getState) => {
    getRequest(url).then(function (nodeData) {
        let typePromise = dispatch(fetchTypes(FETCH_ALL_SYSTEM_TYPES))
        let rolePromise = dispatch(fetchRoles(FETCH_ALL_ROLES))
        let kernelPromise = dispatch(fetchKernels(FETCH_ALL_KERNELS))
        let isoPromise = dispatch(getISOs(FETCH_ALL_ISOS))
        let sitePromise = dispatch(getSites(FETCH_ALL_SITES))
        Promise.all([typePromise, rolePromise, kernelPromise, isoPromise, sitePromise]).then(function () {
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
            Promise.all(provisionPromises).then(function () {
                dispatch(setNodes(I.fromJS(nodes)))
            })
        })
    })
}


export const updateNode = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (updatedNodeData) {
        let storedNodes = getState().nodeSummary.get('nodes')
        storedNodes = storedNodes.map(function (node) {
            if (node.get('Id') === updatedNodeData.Data.Id) {
                node = I.fromJS(updatedNodeData)
            }
            return node
        })
        dispatch(setNodes(I.fromJS(storedNodes)))
    })
}

export const SET_NODES = 'SET_NODES'
export function setNodes(payload) {
    return {
        type: SET_NODES,
        payload: payload
    }
}

export const SET_SELECTED_NODES = 'SET_SELECTED_NODES'
export function setSelectedNodes(payload) {
    return {
        type: SET_SELECTED_NODES,
        payload: payload
    }
}

function convertData(nodes, store) {
    let types = store.systemTypeReducer.getIn(['types'])
    let kernels = store.kernelReducer.getIn(['kernels'])
    let isos = store.baseISOReducer.getIn(['isos'])
    let sites = store.siteReducer.getIn(['sites'])
    let roles = store.roleReducer.getIn(['roles'])

    if (nodes && nodes.length) {
        nodes.map((node) => {
            types.map((item) => {
                if (item.get('Id') == node.Type_Id) {
                    node.Type = item.Name
                }
            })
            kernels.map((item) => {
                if (item.get('Id') == node.Kernel_Id) {
                    node.Kernel = item.Name
                }
            })
            isos.map((item) => {
                if (item.get('Id') == node.Iso_Id) {
                    node.BaseISO = item.Name
                }
            })
            sites.map((item) => {
                if (item.get('Id') == node.Site_Id) {
                    node.site = item.Name
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
        })

        return nodes
    }
    return []
}

