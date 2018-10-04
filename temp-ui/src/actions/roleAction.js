import I from 'immutable'
import { getRequest } from '../apis/RestApi';

export const fetchRoles = (url) => (dispatch) => {
    getRequest(url).then(function (json) {
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
        dispatch(setRoleData(I.fromJS(json.Data)))
    })
}

export const SET_ROLE_DATA = 'SET_ROLE_DATA'
export function setRoleData(payload) {
    return {
        type: SET_ROLE_DATA,
        payload: payload
    }
}

