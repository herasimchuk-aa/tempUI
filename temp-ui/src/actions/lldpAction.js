import I from 'immutable'
import { getRequest } from '../apis/RestApi';

export const getLLDP = (url) => (dispatch) => {
    getRequest(url).then(function (json) {
        dispatch(setLLDPData(I.fromJS(json.Data)))
    })
}

export const SET_LLDP_DATA = 'SET_LLDP_DATA'
export function setLLDPData(payload) {
    return {
        type: SET_LLDP_DATA,
        payload: payload
    }
}