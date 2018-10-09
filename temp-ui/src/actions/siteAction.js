import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';

export const getSites = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        return dispatch(setSiteData(I.fromJS(json.Data)))
    })
}

export const SET_SITE_DATA = 'SET_SITE_DATA'
export function setSiteData(payload) {
    return {
        type: SET_SITE_DATA,
        payload: payload
    }
}

export const addSites = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedSites = getState().siteReducer.getIn(['sites'], I.List())
            storedSites = storedSites.push(I.fromJS(json.Data))
            return dispatch(setSiteData(storedSites))
        }
        throw new Error(json.Message)
    })
}

export const updateSite = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let siteData = json.Data
            let storedSites = getState().siteReducer.get('sites')
            storedSites = storedSites.map(function (site) {
                if (site.get('Id') === siteData.Id) {
                    site = I.fromJS(siteData)
                }
                return site
            })
            return dispatch(setSiteData(I.fromJS(storedSites)))
        }
        throw new Error(json.Message)
    })
}

export const deleteSite = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedSites = store.siteReducer.get('sites')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let site of storedSites) {
                if (params.indexOf(site.get('Id')) > -1 && failure.indexOf(site.get('Id')) < 0) {
                    storedSites = storedSites.deleteIn([storedSites.indexOf(site)])
                    break
                }
            }
            if (changesMade) {
                dispatch(setSiteData(storedSites))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}



