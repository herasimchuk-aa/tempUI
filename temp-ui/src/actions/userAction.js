import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';
import { FETCH_ALL_RBAC_ROLES } from '../apis/RestConfig';
import { fetchUserRoles } from './userRoleAction';

export const fetchUsers = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(fetchUserRoles(FETCH_ALL_RBAC_ROLES)).then(function () {
            return dispatch(setUserSData(I.fromJS(json.Data)))
        })
    })
}

export const SET_USER_DATA = 'SET_USER_DATA'
export function setUserSData(payload) {
    return {
        type: SET_USER_DATA,
        payload: payload
    }
}

export const SET_USER_HEADING = 'SET_USER_HEADING'
export function setUserHeadings(payload) {
    return {
        type: SET_USER_HEADING,
        payload: payload
    }
}


export const addUsers = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        //TODO[greg] Handler status
        //if (json.StatusCode == 200) {
            //let storedUsers = getState().userReducer.getIn(['users'], I.List())
            //storedUsers = storedUsers.push(I.fromJS(json.Data))
            //return dispatch(setUserSData(storedUsers))
        //}
        //throw new Error(json.Message)
    })
}

export const updateUsers = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let userData = json.Data
            let storedUsers = getState().userReducer.get('users')
            storedUsers = storedUsers.map(function (user) {
                if (user.get('Id') === userData.Id) {
                    user = I.fromJS(userData)
                }
                return user
            })
            return dispatch(setUserSData(I.fromJS(storedUsers)))
        }
        throw new Error(json.Message)
    })
}


export const deleteUser = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedUsers = store.userReducer.get('users')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let user of storedUsers) {
                if (params.indexOf(user.get('Id')) > -1 && failure.indexOf(user.get('Id')) < 0) {
                    storedUsers = storedUsers.deleteIn([storedUsers.indexOf(user)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setUserSData(storedUsers))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

