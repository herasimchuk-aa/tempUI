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
            console.log(storedSites)
            storedSites = storedSites.push(I.fromJS(json.Data))
            return dispatch(setSiteData(storedSites))
        }
        throw new Error(json.message)
    })
}

export const editSites = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedSites = getState().siteReducer.getIn(['sites'], I.List())
            // storedSites.map((site) => {
            //     site.get('Id') == 
            // })
            console.log(storedSites)
            // storedSites = storedSites.push(I.fromJS(json.Data))
            dispatch(setSiteData(storedSites))
        }
    })
}

