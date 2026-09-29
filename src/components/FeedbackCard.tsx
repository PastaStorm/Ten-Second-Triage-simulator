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
      case Feedback.CODE_NOT_ASSIGNED: return t('❓ You did not assign a code to this patient')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      case Feedback.CODE_CORRECT: return t('Correct TST category: {{c}}', { c: t(codeToLabel(patient!.code)) })
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      case Feedback.CODE_INCORRECT: return t('TST indicates {{c}}; you assigned {{a}}', { c: t(codeToLabel(patient!.code)), a: t(codeToLabel(patient!.assignedCode!)) })
      case Feedback.NOT_BREATHING: return t('Not breathing: classify as Not Breathing (Silver).')
      case Feedback.WALKING_P3: return t('Can walk: classify as P3 (Green).')
      case Feedback.AGE_UNDER_TWO_P1: return t('Age under 2: classify as P1 (Red).')
      case Feedback.SEVERE_BLEEDING_P1: return t('Severe bleeding: classify as P1 (Red).')
      case Feedback.NOT_TALKING_P1: return t('Not talking: classify as P1 (Red).')
      case Feedback.PENETRATING_INJURY_P1: return t('Talking with a penetrating injury to the neck, chest, armpits, back, abdomen, groin, or buttocks: classify as P1 (Red).')
      case Feedback.OTHERWISE_P2: return t('No P1 or P3 criteria apply: classify as P2 (Yellow).')
      case Feedback.SEVERE_BLEEDING_ACTION: return t('Apply pressure / tourniquet / packing')
      case Feedback.NOT_BREATHING_ACTION: return t('Place in recovery position or CPR if resources allow.')
      case Feedback.NOT_TALKING_P1_ACTION: return t('Place in recovery position.')
      case Feedback.SEVERE_BLEEDING_WALKING: return t('Technically a P3 patient but depending on the severity of the bleed a P1 might be more appropriate')
      case Feedback.PENETRATING_INJURY_WALKING: return t('Technically a P3 patient but depending on the severity of the wound P1 may be more appropriate.')
    }
  }

  if (currentPatientId === undefined) return <></>
  if (patient === undefined) return <></>
  const feedback = TST.getFeedback(patient)

  return (
    <Card className="mt-3">
      <CardHeader title={t('Feedback')}>
        <button
          className="cursor-pointer"
          title={revealFeedback ? t('Hide feedback on patient') : t('Show feedback on patient')}
          aria-label={revealFeedback ? t('Hide feedback on patient') : t('Show feedback on patient')}
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
            {feedback.map((e, i) => <li key={i}>{feedbackToString(e)}</li>)}
          </ol>
        </div>
      }
    </Card>
  )
}

export default FeedbackCard
