import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getPostScript = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setPostScriptData(I.fromJS(json.Data)))
    })
}

export const SET_POSTSCRIPT_DATA = 'SET_POSTSCRIPT_DATA'
export function setPostScriptData(payload) {
    return {
        type: SET_POSTSCRIPT_DATA,
        payload: payload
    }
}

export const addPostScript = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedPostScript = getState().postScriptReducer.getIn(['postScript'], I.List())
            storedPostScript = storedPostScript.push(I.fromJS(json.Data))
            return dispatch(setPostScriptData(storedPostScript))
        }
        throw new Error(json.Message)
    })
}

export const updatePostScript = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let postScriptData = json.Data
            let storedPostScript = getState().postScriptReducer.get('postScript')
            storedPostScript = storedPostScript.map(function (postScript) {
                if (postScript.get('Id') === postScriptData.Id) {
                    postScript = I.fromJS(postScriptData)
                }
                return postScript
            })
            return dispatch(setPostScriptData(I.fromJS(storedPostScript)))
        }
        throw new Error(json.Message)
    })
}


export const deletePostScript = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedPostScript = store.postScriptReducer.get('postScript')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let postScript of storedPostScript) {
                if (params.indexOf(postScript.get('Id')) > -1 && failure.indexOf(postScript.get('Id')) < 0) {
                    storedPostScript = storedPostScript.deleteIn([storedPostScript.indexOf(postScript)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setPostScriptData(storedPostScript))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_POSTSCRIPT_HEADING = 'SET_POSTSCRIPT_HEADING'
export function setPostScripiHeadings(payload) {
    return {
        type: SET_POSTSCRIPT_HEADING,
        payload: payload
    }
}