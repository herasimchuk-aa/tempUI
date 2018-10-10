import { SET_IP_ROUTE_DATA, SET_IP_ROUTE_HEADING } from "../actions/ipRouteAction";
import I from 'immutable'
import { ipRouteHead } from "../consts";

const inititalState = I.fromJS({
    'ipRoutes': I.List(),
    'ipRouteHeadings': I.fromJS(ipRouteHead)
})

export default function ipRouteReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_IP_ROUTE_DATA:
            state = state.set('ipRoutes', action.payload)
            return state
        case SET_IP_ROUTE_HEADING:
            state = state.set('ipRouteHeadings', action.payload)
            return state
        default:
            return state
    }
}