import { SET_ISOS, SET_ISO_HEADING } from "../actions/baseIsoActions";
import I from 'immutable';
import { isoHead } from "../consts";

const initialState = I.fromJS({
    'isos': I.List(),
    'isoHeadings': I.fromJS(isoHead)
})

export default function baseISOReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ISOS: {
            return state.set('isos', action.payload)
        }
        case SET_ISO_HEADING: {
            return state.set('isoHeadings', action.payload)
        }
        default: {
            return state
        }

    }
}


