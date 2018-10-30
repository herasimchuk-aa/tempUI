import { SET_ACCESS_PERMISSIONS, SET_USER_INFO } from "../actions/loginAction";
import I from 'immutable'
const initialState = I.fromJS({
    "accessPermissions": I.Map(),
    "userInfo": I.Map()
})

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ACCESS_PERMISSIONS:
            return state = state.set("accessPermissions", action.payload)
        case SET_USER_INFO:
            return state = state.set("userInfo", action.payload)
        default:
            return state
    }
}