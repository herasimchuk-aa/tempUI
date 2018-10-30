
import I from 'immutable'
import { modProbeHead } from "../consts";
import { SET_MODPROBE_HEADING, SET_MODPROBE_DATA } from '../actions/modProbeAction';

const inititalState = I.fromJS({
    'modProbe': I.List(),
    'modProbeHeadings': I.fromJS(modProbeHead)
})

export default function modProbeReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_MODPROBE_DATA:
            state = state.set('modProbe', action.payload)
            return state
        case SET_MODPROBE_HEADING:
            state = state.set('modProbeHeadings', action.payload)
            return state
        default:
            return state
    }
}