import { SET_ROLE_DATA } from "../actions/roleAction";
import I from 'immutable';

const initialState = I.fromJS({ 'roles': I.List() })

export default function roleReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ROLE_DATA: {
            return state.set('roles', action.payload)
        }
        default: {
            return state
        }

    }
}


