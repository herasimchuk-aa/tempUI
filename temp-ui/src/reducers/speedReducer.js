import { SET_SPEED_DATA } from "../actions/speedAction";
import I from 'immutable';

const initialState = I.fromJS({ 'speeds': I.List() })

export default function speedReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SPEED_DATA: {
            return state.set('speeds', action.payload)
        }
        default: {
            return state
        }

    }
}


