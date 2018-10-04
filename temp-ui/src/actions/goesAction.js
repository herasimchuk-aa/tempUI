import I from 'immutable'
import { getRequest } from '../apis/RestApi';

export const getGoes = (url) => (dispatch) => {
    getRequest(url).then(function (json) {
        dispatch(setGoesData(I.fromJS(json.Data)))
    })
}

export const SET_GOES_DATA = 'SET_GOES_DATA'
export function setGoesData(payload) {
    return {
        type: SET_GOES_DATA,
        payload: payload
    }
}