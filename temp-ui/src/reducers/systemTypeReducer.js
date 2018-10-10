import { SET_TYPE_DATA, SET_TYPE_HEADING } from "../actions/systemTypeAction";
import I from 'immutable'
import { typeHead } from "../consts";

const inititalState = I.fromJS({
    'types': I.List(),
    'typeHeadings': I.fromJS(typeHead)
})

export default function systemTypeReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_TYPE_DATA:
            state = state.set('types', action.payload)
            return state
        case SET_TYPE_HEADING:
            state = state.set('typeHeadings', action.payload)
            return state
        default:
            return state
    }
}
