import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getClusters = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data) {
            let data = I.fromJS(json.Data)
            data = data.map(function (item) {
                return convertCluster(item)
            })
            return dispatch(setClusterData(data))
        }
    })
}

export const SET_CLUSTER_DATA = 'SET_CLUSTER_DATA'
export function setClusterData(payload) {
    return {
        type: SET_CLUSTER_DATA,
        payload: payload
    }
}

function convertCluster(cluster) {
    cluster = cluster.set('SiteName', cluster.getIn(['Site', 'Name'], ''))
    return cluster
}

export const addClusters = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedClusters = getState().clusterReducer.getIn(['clusters'], I.List())
            let data = convertCluster(I.fromJS(json.Data))
            storedClusters = storedClusters.push(data)
            return dispatch(setClusterData(storedClusters))
        }
        throw new Error(json.Message)
    })
}

export const updateCluster = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let clusterData = json.Data
            let storedClusters = getState().clusterReducer.get('clusters')
            storedClusters = storedClusters.map(function (cluster) {
                if (cluster.get('Id') === clusterData.Id) {
                    cluster = convertCluster(I.fromJS(clusterData))
                }
                return cluster
            })
            return dispatch(setClusterData(I.fromJS(storedClusters)))
        }
        throw new Error(json.Message)
    })
}

export const SET_CLUSTER_HEADING = 'SET_CLUSTER_HEADING'
export function setClusterHeadings(payload) {
    return {
        type: SET_CLUSTER_HEADING,
        payload: payload
    }
}


export const deleteCluster = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedClusters = store.clusterReducer.get('clusters')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let cluster of storedClusters) {
                if (params.indexOf(cluster.get('Id')) > -1 && failure.indexOf(cluster.get('Id')) < 0) {
                    storedClusters = storedClusters.deleteIn([storedClusters.indexOf(cluster)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setClusterData(storedClusters))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}



