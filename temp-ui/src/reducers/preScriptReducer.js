
import I from 'immutable'
import { preScriptHead } from "../consts";
import { SET_PRESCRIPT_HEADING, SET_PRESCRIPT_DATA } from '../actions/preScriptAction';

const inititalState = I.fromJS({
    'preScript': I.List(),
    'preScriptHeadings': I.fromJS(preScriptHead)
})

export default function preScriptReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_PRESCRIPT_DATA:
            state = state.set('preScript', action.payload)
            return state
        case SET_PRESCRIPT_HEADING:
            state = state.set('preScriptHeadings', action.payload)
            return state
        default:
            return state
    }
}