import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getModProbe = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setModProbeData(I.fromJS(json.Data)))
    })
}

export const SET_MODPROBE_DATA = 'SET_MODPROBE_DATA'
export function setModProbeData(payload) {
    return {
        type: SET_MODPROBE_DATA,
        payload: payload
    }
}

export const addModProbe = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedModProbe = getState().modProbeReducer.getIn(['modProbe'], I.List())
            storedModProbe = storedModProbe.push(I.fromJS(json.Data))
            return dispatch(setModProbeData(storedModProbe))
        }
        throw new Error(json.Message)
    })
}

export const updateModProbe = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let modProbeData = json.Data
            let storedModProbe = getState().modProbeReducer.get('modProbe')
            storedModProbe = storedModProbe.map(function (modProbe) {
                if (modProbe.get('Id') === modProbeData.Id) {
                    modProbe = I.fromJS(modProbeData)
                }
                return modProbe
            })
            return dispatch(setModProbeData(I.fromJS(storedModProbe)))
        }
        throw new Error(json.Message)
    })
}


export const deleteModProbe = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedModProbe = store.modProbeReducer.get('modProbe')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let modProbe of storedModProbe) {
                if (params.indexOf(modProbe.get('Id')) > -1 && failure.indexOf(modProbe.get('Id')) < 0) {
                    storedModProbe = storedModProbe.deleteIn([storedModProbe.indexOf(modProbe)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setModProbeData(storedModProbe))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_MODPROBE_HEADING = 'SET_MODPROBE_HEADING'
export function setModProbeHeadings(payload) {
    return {
        type: SET_MODPROBE_HEADING,
        payload: payload
    }
}