import { SET_USER_ROLE_DATA, SET_USER_ROLE_HEADING } from "../actions/userRoleAction";
import I from 'immutable'
import { userRoleHead } from "../consts";

const inititalState = I.fromJS({
    'userRoles': I.List(),
    'userRolesHeadings': I.fromJS(userRoleHead)
})

export default function userRoleReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_USER_ROLE_DATA:
            state = state.set('userRoles', action.payload)
            return state
        case SET_USER_ROLE_HEADING:
            state = state.set('userRolesHeadings', action.payload)
            return state
        default:
            return state
    }
}