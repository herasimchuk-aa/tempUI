import I from 'immutable'
import { getRequest } from '../apis/RestApi';

export const getSites = (url) => (dispatch) => {
    getRequest(url).then(function (json) {
        dispatch(setSiteData(I.fromJS(json.Data)))
    })
}

export const SET_SITE_DATA = 'SET_SITE_DATA'
export function setSiteData(payload) {
    return {
        type: SET_SITE_DATA,
        payload: payload
    }
}