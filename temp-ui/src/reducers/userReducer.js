import { SET_USER_DATA, SET_USER_HEADING } from "../actions/userAction";
import I from 'immutable'
import { userHead } from "../consts";

const inititalState = I.fromJS({
    'users': I.List(),
    'userHeadings': I.fromJS(userHead)
})

export default function userReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_USER_DATA:
            state = state.set('users', action.payload)
            return state
        case SET_USER_HEADING:
            state = state.set('userHeadings', action.payload)
            return state
        default:
            return state
    }
}