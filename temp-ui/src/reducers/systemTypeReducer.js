import { SET_TYPE_DATA } from "../actions/systemTypeAction";
import I from 'immutable'

const inititalState = I.fromJS({
    'types': I.List()
})

export default function systemTypeReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_TYPE_DATA:
            state = state.set('types', action.payload)
            return state
        default:
            return state
    }
}
