
import I from 'immutable'
import { postScriptHead } from "../consts";
import { SET_POSTSCRIPT_HEADING, SET_POSTSCRIPT_DATA } from '../actions/postScriptAction';

const inititalState = I.fromJS({
    'postScript': I.List(),
    'postScriptHeadings': I.fromJS(postScriptHead)
})

export default function postScriptReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_POSTSCRIPT_DATA:
            state = state.set('postScript', action.payload)
            return state
        case SET_POSTSCRIPT_HEADING:
            state = state.set('postScriptHeadings', action.payload)
            return state
        default:
            return state
    }
}