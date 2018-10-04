import { combineReducers } from 'redux'
import kernel from './kernelReducer'
import nodeSummary from './nodeReducer'
import { baseISOReducer } from './baseIsoReducer'

export default combineReducers({
    kernel,
    nodeSummary,
    baseIsos: baseISOReducer
})