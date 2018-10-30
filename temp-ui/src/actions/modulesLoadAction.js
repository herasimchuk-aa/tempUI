import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getModulesLoad = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(setModulesLoadData(I.fromJS(json.Data)))
    })
}

export const SET_MODULES_LOAD_DATA = 'SET_MODULES_LOAD_DATA'
export function setModulesLoadData(payload) {
    return {
        type: SET_MODULES_LOAD_DATA,
        payload: payload
    }
}

export const addModulesLoad = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedModulesLoad = getState().modulesLoadReducer.getIn(['modulesLoad'], I.List())
            storedModulesLoad = storedModulesLoad.push(I.fromJS(json.Data))
            return dispatch(setModulesLoadData(storedModulesLoad))
        }
        throw new Error(json.Message)
    })
}

export const updateModulesLoad = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let modulesLoadData = json.Data
            let storedModulesLoad = getState().modulesLoadReducer.get('modulesLoad')
            storedModulesLoad = storedModulesLoad.map(function (modulesLoad) {
                if (modulesLoad.get('Id') === modulesLoadData.Id) {
                    modulesLoad = I.fromJS(modulesLoadData)
                }
                return modulesLoad
            })
            return dispatch(setModulesLoadData(I.fromJS(storedModulesLoad)))
        }
        throw new Error(json.Message)
    })
}


export const deleteModulesLoad = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedModulesLoad = store.modulesLoadReducer.get('modulesLoad')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let modulesLoad of storedModulesLoad) {
                if (params.indexOf(modulesLoad.get('Id')) > -1 && failure.indexOf(modulesLoad.get('Id')) < 0) {
                    storedModulesLoad = storedModulesLoad.deleteIn([storedModulesLoad.indexOf(modulesLoad)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setModulesLoadData(storedModulesLoad))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_MODULES_LOAD_HEADING = 'SET_MODULES_LOAD_HEADING'
export function setModulesLoadHeadings(payload) {
    return {
        type: SET_MODULES_LOAD_HEADING,
        payload: payload
    }
}