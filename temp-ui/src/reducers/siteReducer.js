import { SET_SITE_DATA } from "../actions/siteAction";
import I from 'immutable'

const inititalState = I.fromJS({ 'sites': I.List() })

export default function siteReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_SITE_DATA:
            state = state.set('sites', action.payload)
            return state
        default:
            return state
    }
}