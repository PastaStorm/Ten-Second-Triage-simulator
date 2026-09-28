import { type TypedStartListening, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { type AppDispatch, type RootState } from '.'
import { addPatient, clearPatients, removePatient, setCode } from './patients'
import { setLocale } from './ui'
import { pick } from '../utils'

export const LS_PATIENTS = 'tst-patients'
export const LS_UI = 'ui'

export const persistMiddleware = createListenerMiddleware()

export const startListening = persistMiddleware.startListening as TypedStartListening<RootState, AppDispatch>

startListening({
  matcher: isAnyOf(addPatient, removePatient, clearPatients, setCode),
  effect: (_, listener) => {
    localStorage.setItem(LS_PATIENTS, JSON.stringify(listener.getState().patients))
  }
})

startListening({
  matcher: isAnyOf(setLocale),
  effect: (_, listener) => {
    localStorage.setItem(LS_UI, JSON.stringify(pick(['locale'], listener.getState().ui)))
  }
})
