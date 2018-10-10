import { SET_KERNEL_DATA, SET_KERNEL_HEADING } from "../actions/kernelAction";
import I from 'immutable'
import { kernelHead } from "../consts";

const inititalState = I.fromJS({
    'kernels': I.List(),
    'kernelHeadings': I.fromJS(kernelHead)
})

export default function kernelReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_KERNEL_DATA:
            state = state.set('kernels', action.payload)
            return state
        case SET_KERNEL_HEADING:
            state = state.set('kernelHeadings', action.payload)
            return state
        default:
            return state
    }
}
