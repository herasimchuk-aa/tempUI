import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi'

export const SET_TYPE_DATA = 'SET_TYPE_DATA'
export function setSystemTypeData(payload) {
    return {
        type: SET_TYPE_DATA,
        payload: payload
    }
}

export const fetchTypes = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setSystemTypeData(I.fromJS(json.Data)))
    })
}

export const addTypes = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedTypes = getState().systemTypeReducer.getIn(['types'], I.List())
            storedTypes = storedTypes.push(I.fromJS(json.Data))
            return dispatch(setSystemTypeData(storedTypes))
        }
        throw new Error(json.Message)
    })
}

export const updateType = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let typeData = json.Data
            let storedTypes = getState().systemTypeReducer.get('types')
            storedTypes = storedTypes.map(function (type) {
                if (type.get('Id') === typeData.Id) {
                    type = I.fromJS(typeData)
                }
                return type
            })
            return dispatch(setSystemTypeData(I.fromJS(storedTypes)))
        }
        throw new Error(json.Message)
    })
}

export const deleteType = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedTypes = store.systemTypeReducer.get('types')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let type of storedTypes) {
                if (params.indexOf(type.get('Id')) > -1 && failure.indexOf(type.get('Id')) < 0) {
                    storedTypes = storedTypes.deleteIn([storedTypes.indexOf(type)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setSystemTypeData(storedTypes))
            }
            return json.Data

        }
        throw new Error(json.Message)
    })
}

export const SET_TYPE_HEADING = 'SET_TYPE_HEADING'
export function setTypeHeadings(payload) {
    return {
        type: SET_TYPE_HEADING,
        payload: payload
    }
}