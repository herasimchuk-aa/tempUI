import { combineReducers } from 'redux'
import kernelReducer from './kernelReducer'
import nodeSummary from './nodeReducer'
import baseISOReducer from './baseIsoReducer'
import roleReducer from './roleReducer'
import systemTypeReducer from './systemTypeReducer'

export default combineReducers({
    kernelReducer,
    nodeSummary,
    baseISOReducer,
    roleReducer,
    systemTypeReducer

})