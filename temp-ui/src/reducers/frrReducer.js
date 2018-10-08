import { SET_FRR_DATA } from "../actions/frrAction";
import I from 'immutable'

const inititalState = I.fromJS({ 'frr': I.List() })

export default function frrReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_FRR_DATA:
            state = state.set('frr', action.payload)
            return state
        default:
            return state
    }
}