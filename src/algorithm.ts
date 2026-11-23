import { randomInt, randomBool } from './utils'

export enum Code {
  NOT_BREATHING = 4,
  P1 = 3,
  P2 = 2,
  P3 = 1
}

export interface Patient {
  id: number
  age: number
  code: Code
  assignedCode?: Code
  canWalk: boolean
  severeBleeding: boolean
  talking: boolean
  breathing: boolean
  penetratingTorsoInjury: boolean
  revealedWalking?: boolean
  revealedBleeding?: boolean
  revealedTalking?: boolean
  revealedPenetrating?: boolean
  revealedBreathing?: boolean
  actionBleeding?: boolean
  actionRecovery?: boolean
  actionCPR?: boolean
}

export enum Feedback {
  CODE_NOT_ASSIGNED,
  CODE_CORRECT,
  CODE_INCORRECT,
  NOT_BREATHING,
  WALKING_P3,
  WALKING_P3_NOTE,
  AGE_UNDER_TWO_P1,
  SEVERE_BLEEDING_P1,
  NOT_TALKING_P1,
  PENETRATING_INJURY_P1,
  OTHERWISE_P2,
  SEVERE_BLEEDING_ACTION,
  SEVERE_BLEEDING_ACTION_CORRECT,
  NOT_BREATHING_ACTION,
  NOT_BREATHING_ACTION_CORRECT,
  NOT_TALKING_P1_ACTION,
  NOT_TALKING_P1_ACTION_CORRECT,
  SEVERE_BLEEDING_RECOVERY_NOTE,
  SEVERE_BLEEDING_WALKING,
  ACTION_INCORRECT,
  MISSING_ACTION,
  OVERTRIAGED_BREATHING,
}

class TriageScoringTool {
  newPatient (id?: number): Patient {
    const age = randomInt(0, 80)
    const breathing = randomBool(0.97)
    const canWalk = breathing && age >= 2 ? randomBool(0.35) : false
    const patient = {
      id: id ?? randomInt(0, 500),
      age,
      canWalk,
      severeBleeding: breathing ? randomBool(0.2) : false,
      talking: canWalk ? true : (breathing ? randomBool(0.85) : false),
      breathing,
      penetratingTorsoInjury: randomBool(0.15),
      code: Code.P2,
      revealedWalking: false,
      revealedBleeding: false,
      revealedTalking: false,
      revealedPenetrating: false,
      revealedBreathing: false,
      actionBleeding: false,
      actionRecovery: false,
      actionCPR: false
    }

    return { ...patient, code: this.getCode(patient) }
  }

  getCode (patient: Patient): Code {
    if (!patient.breathing) return Code.NOT_BREATHING
    if (patient.severeBleeding) return Code.P1
    if (patient.canWalk) return Code.P3
    if (patient.age < 2 || !patient.talking || patient.penetratingTorsoInjury) return Code.P1
    return Code.P2
  }

  getRequiredActions (patient: Patient): { bleeding: boolean, recovery: boolean, cpr: boolean } {
    return {
      bleeding: patient.severeBleeding,
      recovery: !patient.severeBleeding && patient.breathing && !patient.talking && !patient.canWalk,
      cpr: !patient.breathing
    }
  }

  validateActions (patient: Patient): { valid: boolean, missing: boolean, incorrect: boolean } {
    const required = this.getRequiredActions(patient)
    const optionalRecovery = patient.severeBleeding && patient.breathing && !patient.talking && !patient.canWalk

    const missing =
      (required.bleeding && !patient.actionBleeding) ||
      (required.recovery && !patient.actionRecovery) ||
      (required.cpr && !patient.actionCPR)

    const incorrect =
      (!required.bleeding && Boolean(patient.actionBleeding)) ||
      (!required.recovery && !optionalRecovery && Boolean(patient.actionRecovery)) ||
      (!required.cpr && Boolean(patient.actionCPR))

    return { valid: !missing && !incorrect, missing, incorrect }
  }

  getFeedback (p: Patient): Feedback[] {
    const feedback = []
    const actionCheck = this.validateActions(p)

    if (p.assignedCode === undefined) {
      feedback.push(Feedback.CODE_NOT_ASSIGNED)
    } else if (p.assignedCode !== p.code) {
      feedback.push(Feedback.CODE_INCORRECT)
    } else {
      feedback.push(Feedback.CODE_CORRECT)
    }

    if (actionCheck.incorrect) feedback.push(Feedback.ACTION_INCORRECT)

    if (!p.breathing) feedback.push(Feedback.NOT_BREATHING)
    else if (p.canWalk && !p.severeBleeding) {
      feedback.push(Feedback.WALKING_P3)
      feedback.push(Feedback.WALKING_P3_NOTE)
    } else if (p.canWalk && p.severeBleeding) {
      feedback.push(Feedback.SEVERE_BLEEDING_WALKING)
    } else if (p.age < 2) feedback.push(Feedback.AGE_UNDER_TWO_P1)
    else if (p.severeBleeding) feedback.push(Feedback.SEVERE_BLEEDING_P1)
    else if (!p.talking) feedback.push(Feedback.NOT_TALKING_P1)
    else if (p.penetratingTorsoInjury) feedback.push(Feedback.PENETRATING_INJURY_P1)
    else feedback.push(Feedback.OTHERWISE_P2)

    if (p.severeBleeding) {
      if (p.actionBleeding) {
        feedback.push(Feedback.SEVERE_BLEEDING_ACTION_CORRECT)
      } else {
        feedback.push(Feedback.SEVERE_BLEEDING_ACTION)
      }
    }

    if (!p.breathing) {
      if (p.actionCPR) {
        feedback.push(Feedback.NOT_BREATHING_ACTION_CORRECT)
      } else {
        feedback.push(Feedback.NOT_BREATHING_ACTION)
      }
    }

    if (p.breathing && !p.talking && !p.canWalk) {
      if (p.severeBleeding) {
        feedback.push(Feedback.SEVERE_BLEEDING_RECOVERY_NOTE)
      } else if (p.actionRecovery) {
        feedback.push(Feedback.NOT_TALKING_P1_ACTION_CORRECT)
      } else {
        feedback.push(Feedback.NOT_TALKING_P1_ACTION)
      }
    }

    if (p.talking && p.revealedBreathing) {
      feedback.push(Feedback.OVERTRIAGED_BREATHING)
    }

    return feedback
  }
}

export const TST = new TriageScoringTool()
