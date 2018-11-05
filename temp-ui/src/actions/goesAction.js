import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getGoes = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setGoesData(I.fromJS(json.Data)))
    })
}

export const SET_GOES_DATA = 'SET_GOES_DATA'
export function setGoesData(payload) {
    return {
        type: SET_GOES_DATA,
        payload: payload
    }
}

export const addGoes = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedGoes = getState().goesReducer.getIn(['goes'], I.List())
            storedGoes = storedGoes.push(I.fromJS(json.Data))
            return dispatch(setGoesData(storedGoes))
        }
        throw new Error(json.Message)
    })
}

export const updateGoes = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let goesData = json.Data
            let storedGoes = getState().goesReducer.get('goes')
            storedGoes = storedGoes.map(function (goes) {
                if (goes.get('Id') === goesData.Id) {
                    goes = I.fromJS(goesData)
                }
                return goes
            })
            return dispatch(setGoesData(I.fromJS(storedGoes)))
        }
        throw new Error(json.Message)
    })
}


export const deleteGoes = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedGoes = store.goesReducer.get('goes')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let goes of storedGoes) {
                if (params.indexOf(goes.get('Id')) > -1 && failure.indexOf(goes.get('Id')) < 0) {
                    storedGoes = storedGoes.deleteIn([storedGoes.indexOf(goes)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setGoesData(storedGoes))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_GOES_HEADING = 'SET_GOES_HEADING'
export function setGoesHeadings(payload) {
    return {
        type: SET_GOES_HEADING,
        payload: payload
    }
}