import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const fetchRoles = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        json.Data.map(function (item, index) {
            let parentId = json.Data[index].ParentId
            json.Data[index].ParentName = '-'
            if (parentId) {
                json.Data.find(function (element) {
                    if (parentId == element.Id) {
                        json.Data[index].ParentName = element.Name
                    }
                })
            }
        })
        return dispatch(setRoleData(I.fromJS(json.Data)))
    })
}

export const SET_ROLE_DATA = 'SET_ROLE_DATA'
export function setRoleData(payload) {
    return {
        type: SET_ROLE_DATA,
        payload: payload
    }
}

export const addRole = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedRoles = getState().roleReducer.getIn(['roles'], I.List())
            json.Data.ParentName = "-"
            if (json.Data.ParentId) {
                storedRoles.toJS().find(function (element) {
                    if (json.Data.ParentId == element.Id) {
                        json.Data.ParentName = element.Name
                        return;
                    }
                })
            }
            storedRoles = storedRoles.push(I.fromJS(json.Data))
            return dispatch(setRoleData(storedRoles))
        }
        throw new Error(json.Message)
    })
}

export const updateRole = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let roleData = json.Data
            roleData.ParentName = "-"
            let storedRoles = getState().roleReducer.getIn(['roles'], I.List())
            if (roleData.ParentId) {
                storedRoles.toJS().find(function (element) {
                    if (roleData.ParentId == element.Id) {
                        roleData.ParentName = element.Name
                    }
                })
            }
            storedRoles = storedRoles.map((role) => {
                if (role.get('Id') == roleData.Id) {
                    role = I.fromJS(roleData)
                    role.ParentName = "-"
                }
                return role
            })
            return dispatch(setRoleData(I.fromJS(storedRoles)))
        }
        throw new Error(json.Message)
    })
}

export const deleteRoles = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedRoles = store.roleReducer.get('roles')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            /* code to be added to delete roles other than the failedDelete */
            for (let role of storedRoles) {
                if (params.indexOf(role.get('Id')) > -1 && failure.indexOf(role.get('Id')) < 0) {
                    storedRoles = storedRoles.deleteIn([storedRoles.indexOf(role)])
                    break
                }
            }
            if (changesMade) {
                dispatch(setRoleData(storedRoles))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

