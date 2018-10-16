import I from 'immutable'
import { entityHead } from "../consts";
import { SET_ENTITY_DATA, SET_ENTITY_HEADING } from "../actions/entityAction";

const inititalState = I.fromJS({
    'entities': I.List(),
    'entityHeadings': I.fromJS(entityHead)
})

export default function siteReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_ENTITY_DATA:
            state = state.set('entities', action.payload)
            return state
        case SET_ENTITY_HEADING:
            state = state.set('entityHeadings', action.payload)
            return state
        default:
            return state
    }
}