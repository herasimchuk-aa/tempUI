
import I from 'immutable'
import { SET_NODES, SET_SELECTED_NODE_IDS, SET_ACTUAL_NODE_INFO, SET_NODE_HEADING } from '../actions/nodeAction';
import { nodeHead } from '../consts';

const inititalState = I.fromJS({
    'nodes': I.List(),
    'selectedNodes': I.List(),
    'actualNode': I.Map(),
    'nodeHeadings': I.fromJS(nodeHead)
})

export default function nodeReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_NODES:
            state = state.set('nodes', action.payload)
            return state
        case SET_SELECTED_NODE_IDS:
            state = state.set('selectedNodeIds', action.payload)
            return state
        case SET_ACTUAL_NODE_INFO:
            state = state.set('actualNode', action.payload)
            return state
        case SET_NODE_HEADING:
            state = state.set('nodeHeadings', action.payload)
            return state
        default:
            return state
    }
}
