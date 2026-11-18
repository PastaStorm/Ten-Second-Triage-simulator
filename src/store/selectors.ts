import { createSelector } from '@reduxjs/toolkit'
import { patientsAdapter } from './patients'
import { type RootState } from '.'
import { TST } from '../algorithm'

export const {
  selectById: patientById,
  selectAll: allPatients
} = patientsAdapter.getSelectors<RootState>((state) => state.patients)

export const selectTriagedPatients = createSelector(
  [allPatients],
  patients => patients.filter(({ assignedCode }) => assignedCode !== undefined)
)

export const selectCorrectlyTriagedPatients = createSelector(
  [selectTriagedPatients],
  patients => patients.filter(p => p.code === p.assignedCode && TST.validateActions(p).valid)
)

export const selectUndertriagedPatients = createSelector(
  [selectTriagedPatients],
  patients => patients.filter(({ code, assignedCode }) => assignedCode !== undefined && code > assignedCode)
)

export const selectOvertriagedPatients = createSelector(
  [selectTriagedPatients],
  patients => patients.filter(({ code, assignedCode }) => assignedCode !== undefined && code < assignedCode)
)

export const selectMissedActionsPatients = createSelector(
  [selectTriagedPatients],
  patients => patients.filter(p => TST.validateActions(p).missing)
)

export const selectIncorrectActionsPatients = createSelector(
  [selectTriagedPatients],
  patients => patients.filter(p => TST.validateActions(p).incorrect)
)

export const selectSevereBleedingPatients = createSelector(
  [allPatients],
  patients => patients.filter(({ severeBleeding }) => severeBleeding)
)
