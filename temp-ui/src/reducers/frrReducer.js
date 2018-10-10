import { SET_FRR_DATA, SET_FRR_HEADING } from "../actions/frrAction";
import I from 'immutable'
import { frrHead } from "../consts";

const inititalState = I.fromJS({
    'frr': I.List(),
    'frrHeadings': I.fromJS(frrHead)
})

export default function frrReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_FRR_DATA:
            state = state.set('frr', action.payload)
            return state
        case SET_FRR_HEADING:
            state = state.set('frrHeadings', action.payload)
            return state
        default:
            return state
    }
}