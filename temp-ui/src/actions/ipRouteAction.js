import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getIpRoute = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(setIpRoutedata(I.fromJS(json.Data)))
    })
}

export const SET_IP_ROUTE_DATA = 'SET_IP_ROUTE_DATA'
export function setIpRoutedata(payload) {
    return {
        type: SET_IP_ROUTE_DATA,
        payload: payload
    }
}

export const addIpRoutes = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedIpRoute = getState().ipRouteReducer.getIn(['ipRoutes'], I.List())
            storedIpRoute = storedIpRoute.push(I.fromJS(json.Data))
            return dispatch(setIpRoutedata(storedIpRoute))
        }
        throw new Error(json.Message)
    })
}

export const updateIpRoute = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let ipRouteData = json.Data
            let storedIpRoute = getState().ipRouteReducer.get('ipRoutes')
            storedIpRoute = storedIpRoute.map(function (ipRoute) {
                if (ipRoute.get('Id') === ipRouteData.Id) {
                    ipRoute = I.fromJS(ipRouteData)
                }
                return ipRoute
            })
            return dispatch(setIpRoutedata(I.fromJS(storedIpRoute)))
        }
        throw new Error(json.Message)
    })
}

export const deleteIpRoute = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedIpRoute = store.ipRouteReducer.get('ipRoutes')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let ipRoute of storedIpRoute) {
                if (params.indexOf(ipRoute.get('Id')) > -1 && failure.indexOf(iso.get('Id')) < 0) {
                    storedIpRoute = storedIpRoute.deleteIn([storedIpRoute.indexOf(ipRoute)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setIpRoutedata(storedIpRoute))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_IP_ROUTE_HEADING = 'SET_IP_ROUTE_HEADING'
export function setIpRouteHeadings(payload) {
    return {
        type: SET_IP_ROUTE_HEADING,
        payload: payload
    }
}