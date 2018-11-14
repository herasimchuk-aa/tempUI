import {getRequest, postRequest, putRequest} from "../apis/RestApiV2";
import {FETCH_LOGIN_DATA, FETCH_ALL_USERS} from "../apis/RestConfig";
import I from 'immutable'

export const login = (params) => function (dispatch) {
    return postRequest(FETCH_LOGIN_DATA, params).then(response => {
        if(response.statusCode==200){
            window.sessionStorage.accessToken = JSON.parse(response.data).token
            return
        }
            throw new Error('Incorrect Credentials')
    })
}

export const SET_USER_INFO = "SET_USER_INFO"
export const setUserInfo = function (payload) {
    return {
        type: SET_USER_INFO,
        payload: payload
    }
}

export const SET_ACCESS_PERMISSIONS = "SET_ACCESS_PERMISSIONS"
export const setAccessPermissions = function (payload) {
    return {
        type: SET_ACCESS_PERMISSIONS,
        payload: payload
    }
}

export function fetchUserProfile(username) {
    return getRequest(FETCH_ALL_USERS).then(response => {
        if(response.statusCode==200){
            var users = JSON.parse(response.data)
            var totalUsers = users.length
            for (var i = 0; i < totalUsers; i++) {
                var user = users[i]
                if (user.username == username) {
                    window.sessionStorage.userProfile=JSON.stringify((user))
                    return
                }
            }
        }
        throw new Error('Unable to get user profile')
    })
}