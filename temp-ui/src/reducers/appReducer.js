import { combineReducers } from 'redux'
import kernelReducer from './kernelReducer'
import roleReducer from './roleReducer'
import systemTypeReducer from './systemTypeReducer'
import nodeReducer from './nodeReducer'
import baseISOReducer from './baseIsoReducer'
import siteReducer from './siteReducer'
import lldpReducer from './lldpReducer'
import goesReducer from './goesReducer'
import ethToolReducer from './ethToolReducer'
import speedReducer from './speedReducer'
import fecReducer from './fecReducer'
import mediaReducer from './mediaReducer'
import ipRouteReducer from './ipRouteReducer'
import frrReducer from './frrReducer'
import kubernetesReducer from './kubernetesReducer'
import entityReducer from './entityReducer'

export default combineReducers({
    nodeReducer,
    baseISOReducer,
    kernelReducer,
    siteReducer,
    goesReducer,
    lldpReducer,
    ethToolReducer,
    roleReducer,
    systemTypeReducer,
    speedReducer,
    fecReducer,
    mediaReducer,
    ipRouteReducer,
    frrReducer,
    kubernetesReducer,
    entityReducer
})