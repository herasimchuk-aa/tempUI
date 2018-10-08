import I from 'immutable'
import { getRequest } from '../apis/RestApi';
import { FETCH_ALL_SPEEDS } from '../apis/RestConfig';

export const fetchSpeeds = () => (dispatch) => {
    return getRequest(FETCH_ALL_SPEEDS).then(function (json) {
        return dispatch(setSpeedData(I.fromJS(json.Data)))
    })
}

export const SET_SPEED_DATA = 'SET_SPEED_DATA'
export function setSpeedData(payload) {
    return {
        type: SET_SPEED_DATA,
        payload: payload
    }
}

