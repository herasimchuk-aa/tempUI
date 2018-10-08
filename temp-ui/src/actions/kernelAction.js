import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

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

export const addKernels = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedkernels = getState().kernelReducer.getIn(['kernels'], I.List())
            storedkernels = storedkernels.push(I.fromJS(json.Data))
            return dispatch(setKernelData(storedkernels)).then(function () {
                return json.Data
            })
        }
        throw new Error(json.Message)
    })
}

export const updateKernel = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let kernelData = json.Data
            let storedkernels = getState().kernelReducer.get('kernels')
            storedkernels = storedkernels.map(function (kernel) {
                if (kernel.get('Id') === kernelData.Id) {
                    kernel = I.fromJS(kernelData)
                }
                return kernel
            })
            return dispatch(setKernelData(I.fromJS(storedkernels)))
        }
        throw new Error(json.Message)
    })
}

