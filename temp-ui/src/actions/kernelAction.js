import I from 'immutable'
import { getRequest } from '../apis/RestApi';

export const fetchKernels = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(setKernelData(I.fromJS(json.Data)))
    })
}

export const SET_KERNEL_DATA = 'SET_KERNEL_DATA'
export function setKernelData(payload) {
    return {
        type: SET_KERNEL_DATA,
        payload: payload
    }
}

