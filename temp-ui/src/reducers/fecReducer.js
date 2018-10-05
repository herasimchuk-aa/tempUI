import { SET_FEC_DATA } from "../actions/fecAction";
import I from 'immutable';

const initialState = I.fromJS({ 'fecs': I.List() })

export default function fecReducer(state = initialState, action) {
    switch (action.type) {
        case SET_FEC_DATA: {
            return state.set('fecs', action.payload)
        }
        default: {
            return state
        }

    }
}


