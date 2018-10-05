import { getRequest } from "../apis/RestApi";
import I from 'immutable'

export const getISOs = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(setISOs(I.fromJS(json.Data)))
    })
}


export const SET_ISOS = 'SET_ISOS'
export function setISOs(payload) {
    return {
        type: SET_ISOS,
        payload: payload
    }
}