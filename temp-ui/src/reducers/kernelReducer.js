import { SET_KERNEL_DATA } from "../actions/kernelAction";
import I from 'immutable'

const inititalState = I.fromJS({
    'kernelData': I.List()
})

export default function kernelReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_KERNEL_DATA:
            state = state.set('kernelData', action.payload)
            return state
        default:
            return state
    }
}
