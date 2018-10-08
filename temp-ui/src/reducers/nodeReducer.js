
import I from 'immutable'
import { SET_NODES, SET_SELECTED_NODES, SET_ACTUAL_NODE_INFO } from '../actions/nodeAction';

const inititalState = I.fromJS({
    'nodes': I.List(),
    'selectedNodes': I.List(),
    'actualNode': I.Map()
})

export default function nodeReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_NODES:
            state = state.set('nodes', action.payload)
            return state
        case SET_SELECTED_NODES:
            state = state.set('selectedNodes', action.payload)
            return state
        case SET_ACTUAL_NODE_INFO:
            state = state.set('actualNode', action.payload)
            return state
        default:
            return state
    }
}
