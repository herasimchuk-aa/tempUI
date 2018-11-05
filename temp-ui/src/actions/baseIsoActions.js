import { getRequest, postRequest, putRequest } from "../apis/RestApi";
import I from 'immutable'

export const getISOs = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setISOs(I.fromJS(json.Data)))
    })
}


export const SET_ISOS = 'SET_ISOS'
export function setISOs(payload) {
    return {
        type: SET_ISOS,
        payload: payload
    }
}

export const SET_ISO_HEADING = 'SET_ISO_HEADING'
export function setISOHeadings(payload) {
    return {
        type: SET_ISO_HEADING,
        payload: payload
    }
}

export const addISOs = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedISOs = getState().baseISOReducer.getIn(['isos'], I.List())
            storedISOs = storedISOs.push(I.fromJS(json.Data))
            return dispatch(setISOs(storedISOs))
        }
        throw new Error(json.Message)
    })
}

export const updateISO = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let isoData = json.Data
            let storedISOs = getState().baseISOReducer.get('isos')
            storedISOs = storedISOs.map(function (iso) {
                if (iso.get('Id') === isoData.Id) {
                    iso = I.fromJS(isoData)
                }
                return iso
            })
            return dispatch(setISOs(I.fromJS(storedISOs)))
        }
        throw new Error(json.Message)
    })
}

export const deleteISO = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedISOs = store.baseISOReducer.get('isos')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let iso of storedISOs) {
                if (params.indexOf(iso.get('Id')) > -1 && failure.indexOf(iso.get('Id')) < 0) {
                    storedISOs = storedISOs.deleteIn([storedISOs.indexOf(iso)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setISOs(storedISOs))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}