import { SET_MEDIA_DATA } from "../actions/mediaAction";
import I from 'immutable';

const initialState = I.fromJS({ 'medias': I.List() })

export default function mediaReducer(state = initialState, action) {
    switch (action.type) {
        case SET_MEDIA_DATA: {
            return state.set('medias', action.payload)
        }
        default: {
            return state
        }

    }
}


