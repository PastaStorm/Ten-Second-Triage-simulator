import { type FunctionComponent } from 'preact'
import { codeToColor, cx } from '../utils'
import Card, { CardHeader } from './Card'
import { allPatients, useAppDispatch, useAppSelector } from '../store'
import { setCurrentPatient, toggleFeedback } from '../store/ui'
import { useGame, useHotkey } from '../hooks'
import Icon from './Icon'
import { type Code, Feedback, type Patient, TST } from '../algorithm'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'preact/hooks'

const INCORRECT_FEEDBACK = new Set<Feedback>([
  Feedback.CODE_INCORRECT,
  Feedback.SEVERE_BLEEDING_ACTION,
  Feedback.NOT_BREATHING_ACTION,
  Feedback.NOT_TALKING_P1_ACTION,
  Feedback.ACTION_INCORRECT,
  Feedback.MISSING_ACTION,
  Feedback.OVERTRIAGED_BREATHING,
  Feedback.OVERTRIAGED_SEVERE_BLEEDING,
  Feedback.OVERTRIAGED_WALKING,
  Feedback.MISSING_PENETRATING_CHECK,
  Feedback.OVERTRIAGED_NOT_TALKING,
])

interface PatientDotProps {
  active?: boolean
  patient: Patient
  onSelect: (id: number) => void
  reveal: boolean
}

const PatientDot: FunctionComponent<PatientDotProps> = ({ active, patient, onSelect, reveal }) => {
  const assignedCode = patient.assignedCode ?? 0
  const cls = cx(
    'inline-block m-0.5 appearance-none cursor-pointer',
    codeToColor(assignedCode as Code)
  )

  const hasIncorrectFeedback = TST.getFeedback(patient).some((fb) => INCORRECT_FEEDBACK.has(fb))
  const wrong = assignedCode !== 0 && (patient.code !== assignedCode || hasIncorrectFeedback)

  let icon = 'circle'
  if (reveal) {
    if (assignedCode === 0) icon = 'help'
    else if (wrong) icon = 'cancel'
    else if (!wrong) icon = 'check_circle'
  }

  return (
    <a
      href="#"
      value={patient.id}
      className={cls}
      onClick={() => { onSelect(patient.id) }}
    >
      <Icon n={icon} className="text-4xl leading-none align-middle" fill={!(active ?? false)} />
    </a>
  )
}

const SkeletonPatientList: FunctionComponent = () => {
  const { t } = useTranslation()
  const { newGame } = useGame()

  return (
    <button className="flex items-center justify-center md:w-6/12 my-1 mx-auto p-4 text-2xl font-black text-white bg-blue-700 hover:bg-blue-800 transition duration-500" onClick={newGame}>
      <Icon n="add" className="text-4xl" /> {t('New disaster')}
    </button>
  )
}

const PatientList: FunctionComponent = () => {
  const { t } = useTranslation()
  const currentPatientId = useAppSelector((state) => state.ui.currentPatient)
  const patients = useAppSelector(allPatients)
  const revealCodes = useAppSelector((state) => state.ui.revealFeedback)
  const dispatch = useAppDispatch()

  const changePatient = useCallback((by: number) => {
    const index = patients.findIndex(({ id }) => id === currentPatientId)
    const next = patients[index + by]
    if (next !== undefined) dispatch(setCurrentPatient(next.id))
  }, [currentPatientId, patients, dispatch])

  const next = useCallback(() => { changePatient(1) }, [changePatient])
  const previous = useCallback(() => { changePatient(-1) }, [changePatient])

  useHotkey('ArrowLeft', previous)
  useHotkey('ArrowRight', next)

  const onSelect = (id: number): void => {
    dispatch(setCurrentPatient(id))
  }

  const onToggleFeedback = (): void => {
    dispatch(toggleFeedback())
  }

  return (
    <Card className="mb-6">
      <CardHeader title={t('Casualties (click on a dot to start).')}>
        <button
          className="cursor-pointer"
          title={revealCodes ? t('Hide correct triage codes') : t('Show correct triage codes')}
          aria-label={revealCodes ? t('Hide correct triage codes') : t('Show correct triage codes')}
          onClick={onToggleFeedback}
        >
          <Icon
            n={revealCodes ? 'visibility_off' : 'visibility'}
            className="text-4xl leading-4 align-middle"
          />
        </button>
      </CardHeader>
      <div className="p-2 max-h-36 overflow-scroll flex justify-items-center justify-center flex-wrap">
        {patients.length === 0 && <SkeletonPatientList />}
        {patients.map((patient) => (
          <PatientDot
            key={patient.id}
            patient={patient}
            onSelect={onSelect}
            active={currentPatientId === patient.id}
            reveal={revealCodes}
          />
        ))}
      </div>
    </Card >
  )
}

export default PatientList
