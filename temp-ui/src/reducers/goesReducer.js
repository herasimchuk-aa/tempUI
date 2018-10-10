import { SET_GOES_DATA ,SET_GOES_HEADING} from "../actions/goesAction";
import I from 'immutable'
import { goesHead } from "../consts";

const inititalState = I.fromJS({
    'goes': I.List(),
    'goesHeadings': I.fromJS(goesHead)
})

export default function goesReducer(state = inititalState, action) {
    switch (action.type) {
        case SET_GOES_DATA:
            state = state.set('goes', action.payload)
            return state
        case SET_GOES_HEADING:
            state = state.set('goesHeadings', action.payload)
            return state
        default:
            return state
    }
}