import { SET_ISOS } from "../actions/baseIsoActions";
import I from 'immutable';

const initialState = I.fromJS({ 'isos': I.List() })

export default function baseISOReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ISOS: {
            return state.set('isos', action.payload)
        }
        default: {
            return state
        }

    }
}


