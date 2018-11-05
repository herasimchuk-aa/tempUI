import I from 'immutable'
import { getRequest, postRequest, putRequest } from '../apis/RestApi';


export const fetchAllEntities = (url) => (dispatch) => {
    return getRequest(url).then(function (json) {
        if (json.Data)
            return dispatch(setEntityData(I.fromJS(json.Data)))
    })
}

export const SET_ENTITY_DATA = 'SET_ENTITY_DATA'
export function setEntityData(payload) {
    return {
        type: SET_ENTITY_DATA,
        payload: payload
    }
}

export const addEntity = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let storedEntities = getState().entityReducer.getIn(['entities'], I.List())
            storedEntities = storedEntities.push(I.fromJS(json.Data))
            return dispatch(setEntityData(storedEntities))
        }
        throw new Error(json.Message)
    })
}

export const deleteEntity = (url, params) => (dispatch, getState) => {
    return postRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let store = getState()
            let storedEntities = store.entityReducer.get('entities')
            let failure = json.Data.Failure ? json.Data.Failure : []
            let changesMade = false
            for (let entity of storedEntities) {
                if (params.indexOf(entity.get('Id')) > -1 && failure.indexOf(entity.get('Id')) < 0) {
                    storedEntities = storedEntities.deleteIn([storedEntities.indexOf(entity)])
                    changesMade = true
                }
            }
            if (changesMade) {
                dispatch(setEntityData(storedEntities))
            }
            return json.Data
        }
        throw new Error(json.Message)
    })
}

export const updateEntity = (url, params) => (dispatch, getState) => {
    return putRequest(url, params).then(function (json) {
        if (json.StatusCode == 200) {
            let entityData = json.Data
            let storedEntities = getState().entityReducer.get('entities')
            storedEntities = storedEntities.map(function (entity) {
                if (entity.get('Id') === entityData.Id) {
                    entity = I.fromJS(entityData)
                }
                return entity
            })
            return dispatch(setEntityData(I.fromJS(storedEntities)))
        }
        throw new Error(json.Message)
    })
}

export const SET_ENTITY_HEADING = 'SET_ENTITY_HEADING'
export function setEntityHeadings(payload) {
    return {
        type: SET_ENTITY_HEADING,
        payload: payload
    }
}
