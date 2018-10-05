import I from 'immutable'
import { getRequest } from '../apis/RestApi';
import { FETCH_ALL_FECS } from '../apis/RestConfig';

export const fetchFecs = () => (dispatch) => {
    getRequest(FETCH_ALL_FECS).then(function (json) {
        dispatch(setFecData(I.fromJS(json.Data)))
    })
}

export const SET_FEC_DATA = 'SET_FEC_DATA'
export function setFecData(payload) {
    return {
        type: SET_FEC_DATA,
        payload: payload
    }
}

