
import I from 'immutable'
import { modulesLoadHead } from "../consts";
import { SET_MODULES_LOAD_DATA, SET_MODULES_LOAD_HEADING } from '../actions/modulesLoadAction';

const inititalState = I.fromJS({
    'modulesLoad': I.List(),
    'modulesLoadHeadings': I.fromJS(modulesLoadHead)
})

export default function modProbeReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_MODULES_LOAD_DATA:
            state = state.set('modulesLoad', action.payload)
            return state
        case SET_MODULES_LOAD_HEADING:
            state = state.set('modulesLoadHeadings', action.payload)
            return state
        default:
            return state
    }
}