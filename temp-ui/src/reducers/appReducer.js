import { combineReducers } from 'redux'
import kernel from './kernelReducer'
import nodeSummary from './nodeReducer'

export default combineReducers({
    kernel,
    nodeSummary
})