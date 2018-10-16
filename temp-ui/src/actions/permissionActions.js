import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getPermissions = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(setPermissionData(I.fromJS(json.Data)))
    })
}

export const SET_PERMISSION_DATA = 'SET_PERMISSION_DATA'
export function setPermissionData(payload) {
    return {
        type: SET_PERMISSION_DATA,
        payload: payload
    }
}

export const SET_PERMISSION_HEADING = 'SET_PERMISSION_HEADING'
export function setPermissionHeadings(payload) {
    return {
        type: SET_PERMISSION_HEADING,
        payload: payload
    }
}

export const addPermission = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedPermissions = getState().permissionReducer.getIn(['permissions'], I.List())
            storedPermissions = storedPermissions.push(I.fromJS(json.Data))
            return dispatch(setPermissionData(storedPermissions))
        }
        throw new Error(json.Message)
    })
}

export const updatePermission = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let permissionData = json.Data
            let storedPermissions = getState().permissionReducer.get('permissions')
            storedPermissions = storedPermissions.map(function (permission) {
                if (permission.get('Id') === permissionData.Id) {
                    permission = I.fromJS(permissionData)
                }
                return permission
            })
            return dispatch(setPermissionData(I.fromJS(storedPermissions)))
        }
        throw new Error(json.Message)
    })
}


export const deletePermission = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedPermissions = store.permissionReducer.get('permissions')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let permission of storedPermissions) {
                if (params.indexOf(permission.get('Id')) > -1 && failure.indexOf(permission.get('Id')) < 0) {
                    storedPermissions = storedPermissions.deleteIn([storedPermissions.indexOf(permission)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setPermissionData(storedPermissions))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}



