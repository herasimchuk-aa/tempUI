import I from 'immutable'
import { getRequest } from '../apis/RestApi'

export const SET_TYPE_DATA = 'SET_TYPE_DATA'
export function setSystemTypeData(payload) {
    return {
        type: SET_TYPE_DATA,
        payload: payload
    }
}

export const fetchTypes = (url) => (dispatch) => {
    getRequest(url).then(function (json) {
        dispatch(setSystemTypeData(I.fromJS(json.Data)))
    })
}