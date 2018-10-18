import { postRequest } from "../apis/RestApi";
import { FETCH_LOGIN_DATA } from "../apis/RestConfig";

export const login = (params) => function (dispatch) {
    return postRequest(FETCH_LOGIN_DATA, params).then(function (json) {
        window.sessionStorage.accessToken = json.Data.token
        return dispatch(setAuthToken(json.Data.token))
    })
    return
}

export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN"
export const setAuthToken = function (payload) {
    return {
        type: SET_AUTH_TOKEN,
        payload: payload
    }
}