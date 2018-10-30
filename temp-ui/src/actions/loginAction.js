import { postRequest } from "../apis/RestApi";
import { FETCH_LOGIN_DATA } from "../apis/RestConfig";
import I from 'immutable'

export const login = (params) => function (dispatch) {
    return postRequest(FETCH_LOGIN_DATA, params).then(function (json) {
        if (json.Data) {
            window.sessionStorage.accessToken = json.Data.token
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