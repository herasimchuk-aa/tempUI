import { SET_ETHTOOL_DATA } from "../actions/ethToolAction";
import I from 'immutable'

const inititalState = I.fromJS({ 'ethTools': I.List() })

export default function ethToolReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_ETHTOOL_DATA:
            state = state.set('ethTools', action.payload)
            return state
        default:
            return state
    }
}