import I from 'immutable'
import { getRequest} from '../apis/RestApiV2';
import { postRequest, putRequest } from '../apis/RestApi';
import { getPermissions } from './permissionActions';
import { FETCH_ALL_PERMISSIONS } from '../apis/RestConfig';

export const fetchUserRoles = (url) => (dispatch) => {
    return getRequest(url).then(function (response) {
        return dispatch(getPermissions(FETCH_ALL_PERMISSIONS)).then(function () {
            return dispatch(setUserRolesData(I.fromJS(JSON.parse(response.data))))
        })

    })
}

export const SET_USER_ROLE_DATA = 'SET_USER_ROLE_DATA'
export function setUserRolesData(payload) {
    return {
        type: SET_USER_ROLE_DATA,
        payload: payload
    }
}

export const SET_USER_ROLE_HEADING = 'SET_USER_ROLE_HEADING'
export function setUserRoleHeadings(payload) {
    return {
        type: SET_USER_ROLE_HEADING,
        payload: payload
    }
}

export const addUserRoles = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedUserRoles = getState().userRoleReducer.getIn(['userRoles'], I.List())
            storedUserRoles = storedUserRoles.push(I.fromJS(json.Data))
            return dispatch(setUserRolesData(storedUserRoles))
        }
        throw new Error(json.Message)
    })
}

export const updateUserRoles = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let userRoleData = json.Data
            let storedUserRoles = getState().userRoleReducer.get('userRoles')
            storedUserRoles = storedUserRoles.map(function (userRole) {
                if (userRole.get('Id') === userRoleData.Id) {
                    userRole = I.fromJS(userRoleData)
                }
                return userRole
            })
            return dispatch(setUserRolesData(I.fromJS(storedUserRoles)))
        }
        throw new Error(json.Message)
    })
}


export const deleteUserRole = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedUserRoles = store.userRoleReducer.get('userRoles')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let userRole of storedUserRoles) {
                if (params.indexOf(userRole.get('Id')) > -1 && failure.indexOf(userRole.get('Id')) < 0) {
                    storedUserRoles = storedUserRoles.deleteIn([storedUserRoles.indexOf(userRole)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setUserRolesData(storedUserRoles))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

