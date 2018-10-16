import { SET_PERMISSION_DATA, SET_PERMISSION_HEADING } from '../actions/permissionActions';
import I from 'immutable'
import { permissionHead } from "../consts";

const inititalState = I.fromJS({
    'permissions': I.List(),
    'permissionHeadings': I.fromJS(permissionHead)
})

export default function permissionReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_PERMISSION_DATA:
            state = state.set('permissions', action.payload)
            return state
        case SET_PERMISSION_HEADING:
            state = state.set('permissionHeadings', action.payload)
            return state
        default:
            return state
    }
}