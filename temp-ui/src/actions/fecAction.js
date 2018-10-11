import I from 'immutable'
import { getRequest } from '../apis/RestApi';
import { FETCH_ALL_FECS } from '../apis/RestConfig';

export const fetchFecs = () => (dispatch) => {
    return getRequest(FETCH_ALL_FECS).then(function (json) {
        return dispatch(setFecData(I.fromJS(json.Data)))
    })
}

export const SET_FEC_DATA = 'SET_FEC_DATA'
export function setFecData(payload) {
    return {
        type: SET_FEC_DATA,
        payload: payload
    }
}

