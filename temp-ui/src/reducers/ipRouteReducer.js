import { SET_IP_ROUTE_DATA } from "../actions/ipRouteAction";
import I from 'immutable'

const inititalState = I.fromJS({ 'ipRoutes': I.List() })

export default function ipRouteReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_IP_ROUTE_DATA:
            state = state.set('ipRoutes', action.payload)
            return state
        default:
            return state
    }
}