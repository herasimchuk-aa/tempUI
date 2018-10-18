import { SET_CLUSTER_DATA, SET_CLUSTER_HEADING } from "../actions/clusterAction";
import I from 'immutable'
import { clusterHead } from "../consts";

const inititalState = I.fromJS({
    'clusters': I.List(),
    'clusterHeadings': I.fromJS(clusterHead)
})

export default function siteReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_CLUSTER_DATA:
            state = state.set('clusters', action.payload)
            return state
        case SET_CLUSTER_HEADING:
            state = state.set('clusterHeadings', action.payload)
            return state
        default:
            return state
    }
}