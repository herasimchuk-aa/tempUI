import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getPreScript = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setPreScriptData(I.fromJS(json.Data)))
    })
}

export const SET_PRESCRIPT_DATA = 'SET_PRESCRIPT_DATA'
export function setPreScriptData(payload) {
    return {
        type: SET_PRESCRIPT_DATA,
        payload: payload
    }
}

export const addPreScript = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedPreScript = getState().preScriptReducer.getIn(['preScript'], I.List())
            storedPreScript = storedPreScript.push(I.fromJS(json.Data))
            return dispatch(setPreScriptData(storedPreScript))
        }
        throw new Error(json.Message)
    })
}

export const updatePreScript = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let preScriptData = json.Data
            let storedPreScript = getState().preScriptReducer.get('preScript')
            storedPreScript = storedPreScript.map(function (preScript) {
                if (preScript.get('Id') === preScriptData.Id) {
                    preScript = I.fromJS(preScriptData)
                }
                return preScript
            })
            return dispatch(setPreScriptData(I.fromJS(storedPreScript)))
        }
        throw new Error(json.Message)
    })
}


export const deletePreScript = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedPreScript = store.preScriptReducer.get('preScript')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let preScript of storedPreScript) {
                if (params.indexOf(preScript.get('Id')) > -1 && failure.indexOf(preScript.get('Id')) < 0) {
                    storedPreScript = storedPreScript.deleteIn([storedPreScript.indexOf(preScript)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setPreScriptData(storedPreScript))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_PRESCRIPT_HEADING = 'SET_PRESCRIPT_HEADING'
export function setPreScripiHeadings(payload) {
    return {
        type: SET_PRESCRIPT_HEADING,
        payload: payload
    }
}