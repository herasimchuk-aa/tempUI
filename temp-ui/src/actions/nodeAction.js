import I from 'immutable'
import { getRequest } from '../apis/RestApi';
import { FETCH_ALL_NODES, FETCH_ALL_SYSTEM_TYPES, FETCH_ALL_ROLES, FETCH_ALL_KERNELS, FETCH_ALL_ISOS, FETCH_ALL_SITES, GET_PROVISION } from '../apis/RestConfig';
export const fetchNodes = (url) => (dispatch) => {
    getRequest(FETCH_ALL_NODES).then(function (nodeData) {
        let typeData = []
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


        Promise.all([typePromise, rolePromise, kernelPromise, isoPromise, sitePromise]).then(function () {
            let nodes = convertData(nodeData.Data, typeData, kernelData, isoData, siteData, roleData)
            //temp code . remove it 
            let provisionPromises = []
            // if (nodes && nodes.length) {
            //     nodes.map(function (node) {
            //         let executionId = node.ExecId
            //         if (executionId) {
            //             let provisionUrl = GET_PROVISION + executionId
            //             provisionPromises.push(getRequest(provisionUrl).then(function (json) {
            //                 node.executionStatusObj = json
            //             }))
            //         }
            //     })
            // }
            Promise.all(provisionPromises).then(function () {
                dispatch(setNodes(I.fromJS(nodes)))
            })
        })


    })
}

export const SET_NODES = 'SET_NODES'
export function setNodes(payload) {
    return {
        type: SET_NODES,
        payload: payload
    }
}

export const SET_SELECTED_NODE_INFO = 'SET_SELECTED_NODE_INFO'
export function setSelectedNode(payload) {
    return {
        type: SET_SELECTED_NODE_INFO,
        payload: payload
    }
}

function convertData(nodes, types, kernels, isos, sites, roles) {
    if (nodes && nodes.length) {

        nodes.map((node) => {
            types.map((item) => {
                if (item.Id == node.Type_Id) {
                    node.Type = item.Name
                }
            })
            kernels.map((item) => {
                if (item.Id == node.Kernel_Id) {
                    node.Kernel = item.Name
                }
            })
            isos.map((item) => {
                if (item.Id == node.Iso_Id) {
                    node.BaseISO = item.Name
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
    return []
}

