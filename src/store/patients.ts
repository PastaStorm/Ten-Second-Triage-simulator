import { type PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { type Code, type Patient } from '../algorithm'

export const patientsAdapter = createEntityAdapter<Patient>()

const initialState = patientsAdapter.getInitialState()

export const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    addPatient: patientsAdapter.addMany,
    removePatient: patientsAdapter.removeOne,
    clearPatients: patientsAdapter.removeAll,
    setCode: (state, { payload: [id, code] }: PayloadAction<[number, Code]>) => {
      patientsAdapter.updateOne(state, { id, changes: { assignedCode: code } })
    },
    toggleReveal: (state, { payload: [id, characteristic] }: PayloadAction<[number, string]>) => {
      const patient = state.entities[id]
      if (patient === undefined) return
      const key = `revealed${characteristic}`
      patientsAdapter.updateOne(state, { id, changes: { [key]: !patient[key as keyof Patient] } })
    },
    toggleAction: (state, { payload: [id, action] }: PayloadAction<[number, string]>) => {
      const patient = state.entities[id]
      if (patient === undefined) return
      const key = `action${action}`
      patientsAdapter.updateOne(state, { id, changes: { [key]: !patient[key as keyof Patient] } })
    }
  }
})

// TODO When crearing an action remember to add it to the matcher in persistMiddleware.ts too
export const {
  addPatient, removePatient, clearPatients, setCode, toggleReveal, toggleAction
} = patientSlice.actions

export default patientSlice.reducer
