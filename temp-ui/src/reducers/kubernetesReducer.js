import { SET_K8S } from "../actions/kubernetesAction";
import I from 'immutable';

const initialState = I.fromJS({ 'k8s': I.List() })

export default function kubernetesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_K8S: {
            return state.set('k8s', action.payload)
        }
        default: {
            return state
        }

    }
}