import { SET_LLDP_DATA, SET_LLDP_HEADING } from "../actions/lldpAction";
import I from 'immutable'
import { lldpHead } from "../consts";

const inititalState = I.fromJS({
    'lldps': I.List(),
    'lldpHeadings': I.fromJS(lldpHead)
})

export default function lldpReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_LLDP_DATA:
            state = state.set('lldps', action.payload)
            return state
        case SET_LLDP_HEADING:
            state = state.set('lldpHeadings', action.payload)
            return state
        default:
            return state
    }
}