import I from 'immutable'
import { getRequest } from '../apis/RestApi';

export const getEthTool = (url) => (dispatch) => {
    getRequest(url).then(function (json) {
        dispatch(setEthToolData(I.fromJS(json.Data)))
    })
}

export const SET_ETHTOOL_DATA = 'SET_ETHTOOL_DATA'
export function setEthToolData(payload) {
    return {
        type: SET_ETHTOOL_DATA,
        payload: payload
    }
}