import { type FunctionComponent } from 'preact'
import { patientById, useAppDispatch, useAppSelector } from '../../store'
import { setCode } from '../../store/patients'
import { type Code } from '../../algorithm'
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
      <TagCodeButton onClick={onChange} value={4} checked={value === 4} title={t('Not Breathing (Silver)')} className="bg-gray-400" />
      <TagCodeButton onClick={onChange} value={3} checked={value === 3} title={t('P1 (Red)')} className="bg-red-600" />
      <TagCodeButton onClick={onChange} value={2} checked={value === 2} title={t('P2 (Yellow)')} className="bg-amber-400" />
      <TagCodeButton onClick={onChange} value={1} checked={value === 1} title={t('P3 (Green)')} className="bg-green-600" />
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

  useHotkey('1', () => { changeCode(3) }) // P1 = red
  useHotkey('2', () => { changeCode(2) })
  useHotkey('3', () => { changeCode(1) }) // P3 = green
  useHotkey('4', () => { changeCode(4) }) // Not breathing = silver

  if (currentPatientId === undefined) return <></>
  if (patient === undefined) return <></>

  return (
    <>
      <Card className='h-min'>
        <TagRow border>
          <TagCell title={t('Triage tag')} span={9}>#{patient.id.toString().padStart(4, '0')}</TagCell>
          <TagCell title={t('Age')} span={3}>{t('{{age}} yrs', { age: patient.age })}</TagCell>
        </TagRow>
        <TagRow>
          <TagCell title={t('Breathing')} span={4}>
            {patient.breathing ? t('Yes') : t('No')}
          </TagCell>
          <TagCell title={t('Can walk?')} span={4}>
            {patient.canWalk ? t('Yes') : t('No')}
          </TagCell>
          <TagCell title={t('Severe bleeding?')} span={4}>
            {patient.severeBleeding ? t('Yes') : t('No')}
          </TagCell>
        </TagRow>
        <TagRow>
          <TagCell title={t('Talking?')} span={6}>
            {patient.talking ? t('Yes') : t('No')}
          </TagCell>
          <TagCell title={t('Penetrating injury to neck, chest, armpits, back, abdomen, groin, or buttocks?')} span={6}>
            {patient.penetratingTorsoInjury ? t('Yes') : t('No')}
          </TagCell>
        </TagRow>
        {patient.severeBleeding &&
          <p className="p-2 text-red-700 font-bold">{t('Apply pressure / tourniquet / packing')}</p>
        }
        <TagCodeSelector value={patient.assignedCode} onChange={(code: Code) => dispatch(setCode([patient.id, code]))} />
      </Card >
      <p className="text-center opacity-75 mt-4 mb-3 hidden lg:block">
        <Trans t={t}>Use <Kbd>←</Kbd> and <Kbd>→</Kbd> to switch patients and keys <Kbd>1</Kbd> to <Kbd>4</Kbd> to assign priorities</Trans>
      </p>
    </>
  )
}

export default TriageTag
