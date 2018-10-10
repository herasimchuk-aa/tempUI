import { SET_ROLE_DATA, SET_ROLE_HEADING } from "../actions/roleAction";
import I from 'immutable';
import { roleHead } from "../consts";

const initialState = I.fromJS({
    'roles': I.List(),
    'roleHeadings': I.fromJS(roleHead)
})

export default function roleReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ROLE_DATA: {
            return state.set('roles', action.payload)
        }
        case SET_ROLE_HEADING:
            state = state.set('roleHeadings', action.payload)
            return state
        default: {
            return state
        }

    }
}


