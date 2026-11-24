import { type FunctionComponent } from 'preact'
import Card, { CardHeader } from './Card'
import { patientById, useAppDispatch, useAppSelector } from '../store'
import { Feedback, TST } from '../algorithm'
import { toggleFeedback } from '../store/ui'
import Icon from './Icon'
import { useTranslation } from 'react-i18next'
import { codeToLabel } from '../utils'

const FeedbackCard: FunctionComponent = () => {
  const currentPatientId = useAppSelector((state) => state.ui.currentPatient)
  const patient = useAppSelector((state) => patientById(state, currentPatientId ?? 0))
  const revealFeedback = useAppSelector((state) => state.ui.revealFeedback)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const onToggleFeedback = (): void => {
    dispatch(toggleFeedback())
  }

  const feedbackToString = (fb: Feedback): string => {
    switch (fb) {
      case Feedback.CODE_NOT_ASSIGNED: return t('❓ You did not assign a priority to this casualty')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      case Feedback.CODE_CORRECT: return t('Correct TST Priority: {{c}}', { c: t(codeToLabel(patient!.code)) })
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      case Feedback.CODE_INCORRECT: return t('TST indicates {{c}}; you assigned {{a}}', { c: t(codeToLabel(patient!.code)), a: t(codeToLabel(patient!.assignedCode!)) })
      case Feedback.NOT_BREATHING: return t('Not breathing: classify as Not Breathing (Silver).')
      case Feedback.WALKING_P3: return t('Can walk: classify as P3 (Green).')
      case Feedback.WALKING_P3_NOTE: return t('P3 casualties should be directed towards a place of safety.')
      case Feedback.AGE_UNDER_TWO_P1: return t('Age under 2: classify as P1 (Red). The majority of children under 2 are unlikely to be able to walk or talk independently so all under 2s should be triaged as P1. (Ref: TST for non clinical responders supplementary information)')
      case Feedback.SEVERE_BLEEDING_P1: return t('Severe bleeding: classify as P1 (Red).')
      case Feedback.NOT_TALKING_P1: return t('Not talking: classify as P1 (Red).')
      case Feedback.PENETRATING_INJURY_P1: return t('Talking with a penetrating injury to the torso: classify as P1 (Red).')
      case Feedback.OTHERWISE_P2: return t('No P1 or P3 criteria apply: classify as P2 (Yellow).')
      case Feedback.SEVERE_BLEEDING_ACTION: return t('Incorrect: You failed to complete the required action for this casualty: you failed to apply pressure / tourniquet / packing.')
      case Feedback.SEVERE_BLEEDING_ACTION_CORRECT: return t('Correct: You applied pressure / tourniquet / packing.')
      case Feedback.NOT_BREATHING_ACTION: return t('Incorrect: You failed to complete the required action for this casualty: you failed to place in recovery position or carry out CPR if resources allow.')
      case Feedback.NOT_BREATHING_ACTION_CORRECT: return t('Correct: You placed in recovery position or carried out CPR if resources allow.')
      case Feedback.NOT_TALKING_P1_ACTION: return t('Incorrect: You failed to complete the required action for this casualty: you failed to place in recovery position.')
      case Feedback.NOT_TALKING_P1_ACTION_CORRECT: return t('Correct: You placed in recovery position.')
      case Feedback.SEVERE_BLEEDING_RECOVERY_NOTE: return t('Although technically not part of the TST algorithm if the casualty is unconscious then it is best practice to place them in the recovery position.')
      case Feedback.SEVERE_BLEEDING_WALKING: return t('Severe bleeding while walking: classify as P1 (Red). Critically injured casualties who are walking should be sat down and triaged/treated as P1. Ref: NARU TST Non Clinical Responders Supplementary Information.')
      case Feedback.ACTION_INCORRECT: return t('Incorrect: You failed to perform the correct action for this casualty OR you carried out an improper action.')
      case Feedback.MISSING_ACTION: return t('Incorrect: You failed to complete the required action for this casualty.')
      case Feedback.OVERTRIAGED_BREATHING: return t('Incorrect: You overtriaged by checking breathing when the casualty was talking.')
      case Feedback.OVERTRIAGED_SEVERE_BLEEDING: return t('Incorrect: You overtriaged; a severe bleed is triaged as P1 so the additional checks are irrelevant.')
      case Feedback.OVERTRIAGED_WALKING: return t('Incorrect: You overtriaged; a walking casualty without severe bleeding is triaged as P3 so the additional checks are irrelevant.')
      case Feedback.MISSING_PENETRATING_CHECK: return t('Incorrect: You failed to check for a penetrating injury.')
      case Feedback.OVERTRIAGED_NOT_TALKING: return t('Incorrect: You overtriaged by checking for a penetrating injury when the casualty was not talking.')
      case Feedback.OVERTRIAGED_AGE_UNDER_TWO: return t('Incorrect: You overtriaged; all children under 2 are triaged as P1 so the additional checks are irrelevant.')
    }
  }

  if (currentPatientId === undefined) return <></>
  if (patient === undefined) return <></>

  const feedback = TST.getFeedback(patient)
  const reasonIndex = feedback.findIndex(fb => [
    Feedback.NOT_BREATHING,
    Feedback.WALKING_P3,
    Feedback.AGE_UNDER_TWO_P1,
    Feedback.SEVERE_BLEEDING_P1,
    Feedback.NOT_TALKING_P1,
    Feedback.PENETRATING_INJURY_P1,
    Feedback.OTHERWISE_P2,
    Feedback.SEVERE_BLEEDING_WALKING
  ].includes(fb))

  const lines: string[] = []
  if (feedback.length > 0) {
    if (reasonIndex > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lines.push(`${feedbackToString(feedback[0])}: ${feedbackToString(feedback[reasonIndex])}`)
      feedback.forEach((fb, idx) => {
        if (idx !== 0 && idx !== reasonIndex) {
          lines.push(feedbackToString(fb))
        }
      })
    } else {
      feedback.forEach(fb => lines.push(feedbackToString(fb)))
    }
  }

  return (
    <Card className="mt-3">
      <CardHeader title={t('Feedback')}>
        <button
          className="cursor-pointer"
          title={revealFeedback ? t('Hide feedback on casualty') : t('Show feedback on casualty')}
          aria-label={revealFeedback ? t('Hide feedback on casualty') : t('Show feedback on casualty')}
          onClick={onToggleFeedback}
        >
          <Icon
            n={revealFeedback ? 'visibility_off' : 'visibility'}
            className="text-4xl leading-4 align-middle"
          />
        </button>
      </CardHeader>
      {revealFeedback &&
        <div className="p-2">
          <ol className="list-name text-lg">
            {lines.map((line, i) => <li key={i}>{line}</li>)}
          </ol>
        </div>
      }
    </Card>
  )
}

export default FeedbackCard
