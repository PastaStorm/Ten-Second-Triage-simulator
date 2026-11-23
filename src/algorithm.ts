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
  OVERTRIAGED_SEVERE_BLEEDING,
  OVERTRIAGED_WALKING,
  MISSING_PENETRATING_CHECK,
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

  getVisualDescription (patient: Patient): string {
    const seed = patient.id
    const sex = seed % 2 === 0 ? 'male' : 'female'
    const pronoun = sex === 'male' ? 'his' : 'her'

    let subject: string
    if (patient.age < 2) {
      subject = `An infant (${sex})`
    } else if (patient.age < 12) {
      subject = `A ${sex} child`
    } else if (patient.age < 18) {
      subject = `A teenage ${sex}`
    } else if (patient.age >= 65) {
      subject = `An elderly ${sex}`
    } else {
      subject = `An adult ${sex}`
    }

    let posture: string
    if (patient.age < 2) {
      posture = [
        'being held near the scene',
        'lying on a blanket on the ground',
        'wrapped in a jacket beside the walkway'
      ][seed % 3]
    } else {
      const groundPostures = [
        'lying on the floor',
        'slumped against the wall',
        'seated on the ground',
        'lying curled on their side',
        'sitting on the kerb with head bowed'
      ]
      const uprightPostures = [
        'crouching near the edge of the area',
        'leaning heavily against a barrier',
        'standing nearby looking disoriented'
      ]
      const availablePostures = (patient.breathing && patient.talking)
        ? [...groundPostures, ...uprightPostures]
        : groundPostures
      posture = availablePostures[seed % availablePostures.length]
    }

    let injuryCue: string
    if (patient.severeBleeding) {
      injuryCue = [
        `with blood soaking through ${pronoun} clothing`,
        `holding ${pronoun} right thigh with dark staining on ${pronoun} trousers`,
        `with a blood-stained sleeve pressed against ${pronoun} arm`,
        `with pooling blood visible near ${pronoun} lower leg`
      ][(seed >> 1) % 4]
    } else if (patient.penetratingTorsoInjury) {
      injuryCue = [
        `clutching ${pronoun} chest with torn clothing`,
        `holding a hand over ${pronoun} abdomen`,
        `with a rip in ${pronoun} jacket over the torso`,
        `guarding ${pronoun} ribs and wincing`
      ][(seed >> 1) % 4]
    } else if (!patient.breathing || !patient.talking) {
      injuryCue = [
        'with eyes closed and appearing very still',
        'not responding to the noise around them',
        'lying quietly with dust and debris on their clothes',
        'looking pale and unresponsive to nearby shouting'
      ][(seed >> 1) % 4]
    } else {
      injuryCue = [
        `with superficial grazes to ${pronoun} palms`,
        `covered in dust and holding ${pronoun} shoulder`,
        `with minor cuts on ${pronoun} forearm`,
        'appearing shaken with no obvious major wounds'
      ][(seed >> 1) % 4]
    }

    return `${subject} ${posture} ${injuryCue}.`
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

    if (p.breathing && !p.severeBleeding && !p.canWalk && p.age >= 2 && p.talking && !p.revealedPenetrating) {
      feedback.push(Feedback.MISSING_PENETRATING_CHECK)
    }

    if (p.severeBleeding && (p.revealedTalking || p.revealedPenetrating || p.revealedBreathing)) {
      feedback.push(Feedback.OVERTRIAGED_SEVERE_BLEEDING)
    } else if (p.canWalk && (p.revealedTalking || p.revealedPenetrating || p.revealedBreathing)) {
      feedback.push(Feedback.OVERTRIAGED_WALKING)
    } else if (p.talking && p.revealedBreathing) {
      feedback.push(Feedback.OVERTRIAGED_BREATHING)
    }

    return feedback
  }
}

export const TST = new TriageScoringTool()
