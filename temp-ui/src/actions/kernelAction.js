import I from 'immutable'
import { getRequest } from '../apis/RestApi';
import { FETCH_ALL_KERNELS } from '../apis/RestConfig';
export const fetchKernels = (url) => (dispatch) => {
    getRequest(FETCH_ALL_KERNELS).then(function (json) {
        dispatch(setKernelData(I.fromJS(json.Data)))
    })
}

export const SET_KERNEL_DATA = 'SET_KERNEL_DATA'
export function setKernelData(payload) {
    return {
        type: SET_KERNEL_DATA,
        payload: payload
    }
}

