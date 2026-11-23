import { type FunctionComponent } from 'preact'
import { cx } from '../../utils'
import Icon from '../Icon'
import Tooltip from '../Tooltip'

interface TagToolProps {
  n?: string
  label?: string
  title: string
  id: string
  onClick?: () => void
  active?: boolean
  bgColor?: string
}

const TagTool: FunctionComponent<TagToolProps> = ({ n, label, title, id, onClick, active, bgColor }) => {
  const cls = cx(
    'flex grow transition duration-500 justify-center items-center px-1 text-center',
    active ? `${bgColor ?? 'bg-blue-600'} text-white` : 'bg-gray-300 text-gray-900',
    !active && 'hover:bg-gray-400 active:bg-gray-400',
    active && 'hover:bg-opacity-80 active:bg-opacity-80'
  )
  const tooltipId = `${id}-tooltip`

  return (
    <Tooltip title={title} id={tooltipId} className='flex grow'>
      <button className={cls} id={id} aria-describedby={tooltipId} onClick={onClick}>
        {label !== undefined
          ? <span className='text-xs sm:text-sm font-semibold leading-tight'>{label}</span>
          : (n !== undefined && <Icon n={n} className='text-4xl sm:text-5xl' />)
        }
      </button>
    </Tooltip>
  )
}

export default TagTool
