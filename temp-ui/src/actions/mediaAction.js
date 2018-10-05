import I from 'immutable'
import { getRequest } from '../apis/RestApi';
import { FETCH_ALL_MEDIAS } from '../apis/RestConfig';

export const fetchMedias = () => (dispatch) => {
    getRequest(FETCH_ALL_MEDIAS).then(function (json) {
        dispatch(setMediaData(I.fromJS(json.Data)))
    })
}

export const SET_MEDIA_DATA = 'SET_MEDIA_DATA'
export function setMediaData(payload) {
    return {
        type: SET_MEDIA_DATA,
        payload: payload
    }
}

