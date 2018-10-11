import I from 'immutable'
import { getRequest, putRequest, postRequest } from '../apis/RestApi';

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

export const addEthTool = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedEthtool = getState().ethToolReducer.getIn(['ethTools'], I.List())
            storedEthtool = storedEthtool.push(I.fromJS(json.Data))
            return dispatch(setEthToolData(storedEthtool))
        }
        throw new Error(json.Message)
    })
}

export const updateEthTool = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let EthToolData = json.Data
            let storedEthtool = getState().ethToolReducer.get('ethTools')
            storedEthtool = storedEthtool.map(function (ethTool) {
                if (ethTool.get('Id') === EthToolData.Id) {
                    ethTool = I.fromJS(EthToolData)
                }
                return ethTool
            })
            return dispatch(setEthToolData(I.fromJS(storedEthtool)))
        }
        throw new Error(json.Message)
    })
}

export const deleteEthTools = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedEthtool = store.ethToolReducer.get('ethTools')
            let changesMade = false
            let failure = json.Data.Failure ? json.Data.Failure : []
            for (let ethTool of storedEthtool) {
                if (params.indexOf(ethTool.get('Id')) > -1 && failure.indexOf(iso.get('Id')) < 0) {
                    storedEthtool = storedEthtool.deleteIn([storedEthtool.indexOf(ethTool)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setEthToolData(storedEthtool))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const SET_ETHTOOL_HEADING = 'SET_ETHTOOL_HEADING'
export function setEthtoolHeadings(payload) {
    return {
        type: SET_ETHTOOL_HEADING,
        payload: payload
    }
}