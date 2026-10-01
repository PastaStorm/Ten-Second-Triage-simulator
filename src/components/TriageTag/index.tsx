import { type FunctionComponent } from 'preact'
import { patientById, useAppDispatch, useAppSelector } from '../../store'
import { setCode, toggleReveal, toggleAction } from '../../store/patients'
import { type Code, TST } from '../../algorithm'
import TagRow from './TagRow'
import TagCell from './TagCell'
import TagTool from './TagTool'
import TagCodeButton from './TagCodeButton'
import Card from '../Card'
import { Trans, useTranslation } from 'react-i18next'
import { useCallback } from 'preact/hooks'
import { useHotkey } from '../../hooks'
import Kbd from '../Kbd'

const TagCodeSelector: FunctionComponent<{ value?: number, onChange: (code: Code) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-4 h-20 text-white cursor-pointer">
      <TagCodeButton onClick={onChange} value={3} checked={value === 3} title={t('P1 (Red)')} className="bg-red-600" />
      <TagCodeButton onClick={onChange} value={2} checked={value === 2} title={t('P2 (Yellow)')} className="bg-amber-400" />
      <TagCodeButton onClick={onChange} value={1} checked={value === 1} title={t('P3 (Green)')} className="bg-green-600" />
      <TagCodeButton onClick={onChange} value={4} checked={value === 4} title={t('Not Breathing (Silver)')} className="bg-gray-400" />
    </div>
  )
}

const TriageTag: FunctionComponent = () => {
  const { t } = useTranslation()
  const currentPatientId = useAppSelector((state) => state.ui.currentPatient)
  const patient = useAppSelector((state) => patientById(state, currentPatientId ?? 0))
  const dispatch = useAppDispatch()

  const changeCode = useCallback((code: Code) => {
    if (currentPatientId === undefined) return
    dispatch(setCode([currentPatientId, code]))
  }, [currentPatientId, dispatch])

  const toggleRevealCharacteristic = useCallback((characteristic: string) => {
    if (currentPatientId === undefined) return
    dispatch(toggleReveal([currentPatientId, characteristic]))
  }, [currentPatientId, dispatch])

  const toggleActionButton = useCallback((action: string) => {
    if (currentPatientId === undefined) return
    dispatch(toggleAction([currentPatientId, action]))
  }, [currentPatientId, dispatch])

  useHotkey('1', () => { changeCode(3) }) // P1 = red
  useHotkey('2', () => { changeCode(2) })
  useHotkey('3', () => { changeCode(1) }) // P3 = green
  useHotkey('4', () => { changeCode(4) }) // Not breathing = silver

  if (currentPatientId === undefined) return <></>
  if (patient === undefined) return <></>

  const requiredActions = TST.getRequiredActions(patient)

  return (
    <>
      <Card className='h-min'>
        <TagRow border>
          <TagCell title={t('Triage tag')} span={9}>#{patient.id.toString().padStart(4, '0')}</TagCell>
          <TagCell title={t('Age')} span={3}>{t('{{age}} yrs', { age: patient.age })}</TagCell>
        </TagRow>
        <TagRow>
          <TagCell title={t('Breathing')} span={4}>
            {patient.revealedBreathing ? (patient.breathing ? t('Yes') : t('No')) : '--'}
          </TagCell>
          <TagCell title={t('Can walk?')} span={4}>
            {patient.revealedWalking ? (patient.canWalk ? t('Yes') : t('No')) : '--'}
          </TagCell>
          <TagCell title={t('Severe bleeding?')} span={4}>
            {patient.revealedBleeding ? (patient.severeBleeding ? t('Yes') : t('No')) : '--'}
          </TagCell>
        </TagRow>
        <TagRow>
          <TagCell title={t('Talking?')} span={6}>
            {patient.revealedTalking ? (patient.talking ? t('Yes') : t('No')) : '--'}
          </TagCell>
          <TagCell title={t('Penetrating injury to neck, chest, armpits, back, abdomen, groin, or buttocks?')} span={6}>
            {patient.revealedPenetrating ? (patient.penetratingTorsoInjury ? t('Yes') : t('No')) : '--'}
          </TagCell>
        </TagRow>
        <div className='grid grid-cols-4 h-20 text-white gap-1'>
          <TagTool title={t('Check walking')} id='reveal-walking' n='directions_walk' onClick={() => toggleRevealCharacteristic('Walking')} active={patient.revealedWalking} bgColor='bg-blue-600' />
          <TagTool title={t('Check severe bleeding')} id='reveal-bleeding' n='healing' onClick={() => toggleRevealCharacteristic('Bleeding')} active={patient.revealedBleeding} bgColor='bg-blue-600' />
          <TagTool title={t('Check talking')} id='reveal-talking' n='record_voice_over' onClick={() => toggleRevealCharacteristic('Talking')} active={patient.revealedTalking} bgColor='bg-blue-600' />
          <TagTool title={t('Check penetrating injury')} id='reveal-penetrating' n='cut' onClick={() => toggleRevealCharacteristic('Penetrating')} active={patient.revealedPenetrating} bgColor='bg-blue-600' />
        </div>
        <div className='grid grid-cols-4 h-20 text-white gap-1'>
          <TagTool title={t('Check breathing')} id='reveal-breathing' n='respiratory_rate' onClick={() => toggleRevealCharacteristic('Breathing')} active={patient.revealedBreathing} bgColor='bg-blue-600' />
          <TagTool title={t('Apply pressure / tourniquet / packing')} id='action-bleeding' n='healing' onClick={() => toggleActionButton('Bleeding')} active={patient.actionBleeding} bgColor={patient.actionBleeding ? 'bg-red-600' : 'bg-blue-600'} />
          <TagTool title={t('Place in recovery position')} id='action-recovery' n='elderly' onClick={() => toggleActionButton('Recovery')} active={patient.actionRecovery} bgColor={patient.actionRecovery ? 'bg-red-600' : 'bg-blue-600'} />
          <TagTool title={t('CPR if resources allow')} id='action-cpr' n='favorite' onClick={() => toggleActionButton('CPR')} active={patient.actionCPR} bgColor={patient.actionCPR ? 'bg-red-600' : 'bg-blue-600'} />
        </div>
        <TagCodeSelector value={patient.assignedCode} onChange={(code: Code) => dispatch(setCode([patient.id, code]))} />
      </Card >
      <p className="text-center opacity-75 mt-4 mb-3 hidden lg:block">
        <Trans t={t}>Use <Kbd>←</Kbd> and <Kbd>→</Kbd> to switch patients and keys <Kbd>1</Kbd> to <Kbd>4</Kbd> to assign priorities</Trans>
      </p>
    </>
  )
}

export default TriageTag
