import { SET_SITE_DATA, SET_SITE_HEADING } from "../actions/siteAction";
import I from 'immutable'
import { siteHead } from "../consts";

const inititalState = I.fromJS({
    'sites': I.List(),
    'siteHeadings': I.fromJS(siteHead)
})

export default function siteReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_SITE_DATA:
            state = state.set('sites', action.payload)
            return state
        case SET_SITE_HEADING:
            state = state.set('siteHeadings', action.payload)
            return state
        default:
            return state
    }
}