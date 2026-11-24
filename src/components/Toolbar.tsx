import { type FunctionComponent } from 'preact'
import Icon from './Icon'
import { useGame, useModal } from '../hooks'
import { STATS_MODAL_ID } from './modals/StatsModal'
import { INFO_MODAL_ID } from './modals/InfoModal'
import { useTranslation } from 'react-i18next'

interface ToolbarIconProps { n: string, title: string, onClick?: () => void }

const ToolbarIcon: FunctionComponent<ToolbarIconProps> = ({ n, title, onClick }) => (
  <a href="#" title={title} onClick={onClick}>
    <Icon n={n} className='text-3xl' />
  </a>
)

const Toolbar: FunctionComponent = () => {
  const { t } = useTranslation()
  const { newGame } = useGame()
  const { open: openStats } = useModal(STATS_MODAL_ID)
  const { open: openInfo } = useModal(INFO_MODAL_ID)

  const onReload = (): void => { newGame() }

  return (
    <div className="flex flex-row items-center gap-2 mb-4">
      <span className="text-lg font-black flex-1">
        <span className="inline-block" style={{ filter: 'hue-rotate(115deg)' }}>
          ⛑
        </span>{' '}
        NHS TST Simulator
      </span>
      <ToolbarIcon n="info" title={t('About')} onClick={openInfo} />
      <ToolbarIcon n="show_chart" title={t('Statistics')} onClick={openStats} />
      <ToolbarIcon n="restart_alt" title={t('New disaster')} onClick={onReload} />
    </div>
  )
}

export default Toolbar
