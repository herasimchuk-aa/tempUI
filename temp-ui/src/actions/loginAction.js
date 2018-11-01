import { postRequest, putRequest } from "../apis/RestApi";
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

export const updatePassword = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            // let LLDPData = json.Data
            // let storedLLDP = getState().lldpReducer.get('lldps')
            // storedLLDP = storedLLDP.map(function (LLDP) {
            //     if (LLDP.get('Id') === LLDPData.Id) {
            //         LLDP = I.fromJS(LLDPData)
            //     }
            //     return LLDP
            // })
            // return dispatch(setLLDPData(I.fromJS(storedLLDP)))
        }
        throw new Error(json.Message)
    })
}