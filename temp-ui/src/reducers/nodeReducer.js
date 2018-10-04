
import I from 'immutable'
import { SET_NODES, SET_SELECTED_NODE_INFO } from '../actions/nodeAction';

const inititalState = I.fromJS({
    'nodes': I.List()
})

export default function nodeReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_NODES:
            state = state.set('nodes', action.payload)
            return state
        case SET_SELECTED_NODE_INFO:
            state = state.set('selectedNode', action.payload)
            return state
        default:
            return state
    }
}
