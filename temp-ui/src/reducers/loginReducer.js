import { SET_AUTH_TOKEN } from "../actions/loginAction";
import I from 'immutable'
const initialState = I.fromJS({
    "authToken": ""
})

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return state = state.set("authToken", action.payload)
        default:
            return state
    }
}