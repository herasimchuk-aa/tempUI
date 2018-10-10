import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getFrr = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(setFrrData(I.fromJS(json.Data)))
    })
}

export const SET_FRR_DATA = 'SET_FRR_DATA'
export function setFrrData(payload) {
    return {
        type: SET_FRR_DATA,
        payload: payload
    }
}

export const addFrr = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedFrr = getState().frrReducer.getIn(['frr'], I.List())
            storedFrr = storedFrr.push(I.fromJS(json.Data))
            return dispatch(setFrrData(storedFrr))
        }
        throw new Error(json.Message)
    })
}

export const updateFrr = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let frrData = json.Data
            let storedFrr = getState().frrReducer.get('frr')
            storedFrr = storedFrr.map(function (frr) {
                if (frr.get('Id') === frrData.Id) {
                    frr = I.fromJS(frrData)
                }
                return frr
            })
            return dispatch(setFrrData(I.fromJS(storedFrr)))
        }
        throw new Error(json.Message)
    })
}


export const deleteFrrs = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedFrr = store.frrReducer.get('frr')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let frr of storedFrr) {
                if (params.indexOf(frr.get('Id')) > -1 && failure.indexOf(iso.get('Id')) < 0) {
                    storedFrr = storedFrr.deleteIn([storedFrr.indexOf(frr)])
                    break
                }
            }
            if (changesMade) {
                dispatch(setFrrData(storedFrr))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_FRR_HEADING = 'SET_FRR_HEADING'
export function setFrrHeadings(payload) {
    return {
        type: SET_FRR_HEADING,
        payload: payload
    }
}
