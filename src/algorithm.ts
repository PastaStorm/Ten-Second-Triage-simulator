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
}

export enum Feedback {
  CODE_NOT_ASSIGNED,
  CODE_CORRECT,
  CODE_INCORRECT,
  NOT_BREATHING,
  WALKING_P3,
  AGE_UNDER_TWO_P1,
  SEVERE_BLEEDING_P1,
  NOT_TALKING_P1,
  PENETRATING_INJURY_P1,
  OTHERWISE_P2,
  SEVERE_BLEEDING_ACTION,
  NOT_BREATHING_ACTION,
  NOT_TALKING_P1_ACTION,
  SEVERE_BLEEDING_WALKING,
}

class TriageScoringTool {
  newPatient (id?: number): Patient {
    const age = randomInt(0, 80)
    const patient = {
      id: id ?? randomInt(0, 500),
      age,
      canWalk: randomBool(0.35),
      severeBleeding: randomBool(0.2),
      talking: randomBool(0.85),
      breathing: randomBool(0.97),
      penetratingTorsoInjury: randomBool(0.15),
      code: Code.P2
    }

    return { ...patient, code: this.getCode(patient) }
  }

  getCode (patient: Patient): Code {
    if (!patient.breathing) return Code.NOT_BREATHING
    if (patient.canWalk) return Code.P3
    if (patient.age < 2 || patient.severeBleeding || !patient.talking || patient.penetratingTorsoInjury) return Code.P1
    return Code.P2
  }

  getFeedback (p: Patient): Feedback[] {
    const feedback = []

    if (p.assignedCode === undefined) feedback.push(Feedback.CODE_NOT_ASSIGNED)
    else if (p.assignedCode !== p.code) {
      feedback.push(Feedback.CODE_INCORRECT)
    } else feedback.push(Feedback.CODE_CORRECT)

    if (!p.breathing) feedback.push(Feedback.NOT_BREATHING)
    else if (p.canWalk) feedback.push(Feedback.WALKING_P3)
    else if (p.age < 2) feedback.push(Feedback.AGE_UNDER_TWO_P1)
    else if (p.severeBleeding) feedback.push(Feedback.SEVERE_BLEEDING_P1)
    else if (!p.talking) feedback.push(Feedback.NOT_TALKING_P1)
    else if (p.penetratingTorsoInjury) feedback.push(Feedback.PENETRATING_INJURY_P1)
    else feedback.push(Feedback.OTHERWISE_P2)

    if (p.severeBleeding) feedback.push(Feedback.SEVERE_BLEEDING_ACTION)
    if (!p.breathing) feedback.push(Feedback.NOT_BREATHING_ACTION)
    if (!p.talking && p.breathing) feedback.push(Feedback.NOT_TALKING_P1_ACTION)
    if (p.severeBleeding && p.canWalk) feedback.push(Feedback.SEVERE_BLEEDING_WALKING)

    return feedback
  }
}

export const TST = new TriageScoringTool()
