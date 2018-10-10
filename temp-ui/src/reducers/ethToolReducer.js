import { SET_ETHTOOL_DATA, SET_ETHTOOL_HEADING } from "../actions/ethToolAction";
import I from 'immutable';
import { ethHead } from "../consts";

const inititalState = I.fromJS({
    'ethTools': I.List(),
    'ethToolHeadings': I.fromJS(ethHead)
})

export default function ethToolReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_ETHTOOL_DATA:
            state = state.set('ethTools', action.payload)
            return state
        case SET_ETHTOOL_HEADING:
            state = state.set('ethToolHeadings', action.payload)
            return state
        default:
            return state
    }
}