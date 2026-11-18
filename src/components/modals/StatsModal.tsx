import { type FunctionComponent } from 'preact'
import Modal from '.'
import { pct } from '../../utils'
import {
  allPatients,
  selectCorrectlyTriagedPatients,
  selectIncorrectActionsPatients,
  selectMissedActionsPatients,
  selectOvertriagedPatients,
  selectTriagedPatients,
  selectUndertriagedPatients,
  useAppSelector
} from '../../store'
import { useTranslation } from 'react-i18next'

export const STATS_MODAL_ID = 'stats'

const Figure: FunctionComponent<{ n: string, label: string }> = ({ n, label }) => (
  <li className="flex flex-col items-center text-center col-span-3">
    <span className="block text-4xl sm:text-5xl font-black mb-1">
      {n}
    </span>
    <span className="block text-base sm:text-xl">{label}</span>
  </li>
)

const StatsModal: FunctionComponent = () => {
  const patients = useAppSelector(allPatients).length
  const triaged = useAppSelector(selectTriagedPatients).length
  const correct = useAppSelector(selectCorrectlyTriagedPatients).length
  const undertriaged = useAppSelector(selectUndertriagedPatients).length
  const overtriaged = useAppSelector(selectOvertriagedPatients).length
  const missedActions = useAppSelector(selectMissedActionsPatients).length
  const incorrectActions = useAppSelector(selectIncorrectActionsPatients).length
  const { t } = useTranslation()

  return (
    <Modal name={STATS_MODAL_ID} title={t('Statistics')}>
      <ul className="grid grid-cols-6 gap-4 mb-4">
        <Figure n={pct(triaged / patients)} label={t('Triaged ({{n}})', { n: triaged })} />
        <Figure n={pct(correct / triaged)} label={t('Correct ({{n}})', { n: correct })} />
      </ul>
      <ul className="grid grid-cols-6 gap-4 mb-4">
        <Figure n={pct(undertriaged / triaged)} label={t('Undertriaged ({{n}})', { n: undertriaged })} />
        <Figure n={pct(overtriaged / triaged)} label={t('Overtriaged ({{n}})', { n: overtriaged })} />
      </ul>
      <ul className="grid grid-cols-6 gap-4">
        <Figure n={pct(missedActions / triaged)} label={t('Missed actions ({{n}})', { n: missedActions })} />
        <Figure n={pct(incorrectActions / triaged)} label={t('Incorrect actions ({{n}})', { n: incorrectActions })} />
      </ul>
    </Modal>
  )
}

export default StatsModal
