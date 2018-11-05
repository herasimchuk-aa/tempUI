import I from 'immutable'
import { getRequest } from '../apis/RestApi';

export const getk8 = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setK8Data(I.fromJS(json.Data)))
    })
}

export const SET_K8S = 'SET_K8S'
export function setK8Data(payload) {
    return {
        type: SET_K8S,
        payload: payload
    }
}