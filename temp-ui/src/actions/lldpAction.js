import I from 'immutable'
import { getRequest, putRequest, postRequest } from '../apis/RestApi';

export const getLLDP = (url) => (dispatch) => {
    getRequest(url).then(function (json) {
        dispatch(setLLDPData(I.fromJS(json.Data)))
    })
}

export const SET_LLDP_DATA = 'SET_LLDP_DATA'
export function setLLDPData(payload) {
    return {
        type: SET_LLDP_DATA,
        payload: payload
    }
}

export const addLLDP = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedLLDP = getState().lldpReducer.getIn(['lldps'], I.List())
            storedLLDP = storedLLDP.push(I.fromJS(json.Data))
            return dispatch(setLLDPData(storedLLDP))
        }
        throw new Error(json.Message)
    })
}

export const updateLLDP = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let LLDPData = json.Data
            let storedLLDP = getState().lldpReducer.get('lldps')
            storedLLDP = storedLLDP.map(function (LLDP) {
                if (LLDP.get('Id') === LLDPData.Id) {
                    LLDP = I.fromJS(LLDPData)
                }
                return LLDP
            })
            return dispatch(setLLDPData(I.fromJS(storedLLDP)))
        }
        throw new Error(json.Message)
    })
}


export const deleteLLDP = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedLLDP = store.lldpReducer.get('lldps')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let LLDP of storedLLDP) {
                if (params.indexOf(LLDP.get('Id')) > -1 && failure.indexOf(iso.get('Id')) < 0) {
                    storedLLDP = storedLLDP.deleteIn([storedLLDP.indexOf(LLDP)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setLLDPData(storedLLDP))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}



export const SET_LLDP_HEADING = 'SET_LLDP_HEADING'
export function setLLDPHeadings(payload) {
    return {
        type: SET_LLDP_HEADING,
        payload: payload
    }
}