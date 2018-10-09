import I from 'immutable'
import { getRequest, postRequest } from '../apis/RestApi';

export const fetchRoles = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        json.Data.map(function (item, index) {
            let parentId = json.Data[index].ParentId
            json.Data[index].ParentName = '-'
            if (parentId) {
                json.Data.find(function (element) {
                    if (parentId == element.Id) {
                        json.Data[index].ParentName = element.Name
                    }
                })
            }
        })
        return dispatch(setRoleData(I.fromJS(json.Data)))
    })
}

export const SET_ROLE_DATA = 'SET_ROLE_DATA'
export function setRoleData(payload) {
    return {
        type: SET_ROLE_DATA,
        payload: payload
    }
}

export const addRole = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedRoles = getState().roleReducer.getIn(['roles'], I.List())
            json.Data.ParentName = "-"
            if (json.Data.ParentId) {
                storedRoles.toJS().find(function (element, index) {
                    if (json.Data.ParentId == element.Id) {
                        json.Data.ParentName = element.Name
                        return;
                    }
                })
            }
            storedRoles = storedRoles.push(I.fromJS(json.Data))
            return dispatch(setRoleData(storedRoles))
        }
    })
}

