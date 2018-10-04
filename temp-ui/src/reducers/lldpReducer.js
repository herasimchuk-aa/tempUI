import { SET_LLDP_DATA } from "../actions/lldpAction";
import I from 'immutable'

const inititalState = I.fromJS({ 'lldps': I.List() })

export default function lldpReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_LLDP_DATA:
            state = state.set('lldps', action.payload)
            return state
        default:
            return state
    }
}