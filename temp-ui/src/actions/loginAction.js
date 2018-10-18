import { postRequest } from "../apis/RestApi";
import { FETCH_LOGIN_DATA } from "../apis/RestConfig";

export const login = (params) => function (dispatch) {
    return postRequest(FETCH_LOGIN_DATA, params).then(function (json) {
        if (json.Data) {
            window.sessionStorage.accessToken = json.Data.token
            return dispatch(setAuthToken(json.Data.token))
        }
        throw new Error('Incorrect Credentials')
    })
}

export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN"
export const setAuthToken = function (payload) {
    return {
        type: SET_AUTH_TOKEN,
        payload: payload
    }
}