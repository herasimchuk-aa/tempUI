import { SET_GOES_DATA } from "../actions/goesAction";
import I from 'immutable'

const inititalState = I.fromJS({ 'goes': I.List() })

export default function goesReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_GOES_DATA:
            state = state.set('goes', action.payload)
            return state
        default:
            return state
    }
}