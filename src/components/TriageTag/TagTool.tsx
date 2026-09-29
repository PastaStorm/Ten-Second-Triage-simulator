import { type FunctionComponent } from 'preact'
import { cx } from '../../utils'
import Icon from '../Icon'
import Tooltip from '../Tooltip'

interface TagToolProps { n: string, title: string, id: string, onClick?: () => void, active?: boolean, bgColor?: string }

const TagTool: FunctionComponent<TagToolProps> = ({ n, title, id, onClick, active, bgColor }) => {
  const cls = cx(
    'flex grow transition duration-500',
    active ? (bgColor ?? 'bg-blue-600') : 'bg-gray-300',
    !active && 'hover:bg-gray-400 active:bg-gray-400',
    active && 'hover:bg-opacity-80 active:bg-opacity-80'
  )
  const tooltipId = `${id}-tooltip`

  return (
    <Tooltip title={title} id={tooltipId} className='flex grow'>
      <button className={cls} id={id} aria-describedby={tooltipId} onClick={onClick}>
        <Icon n={n} className='text-4xl sm:text-5xl block m-auto' />
      </button>
    </Tooltip>
  )
}

export default TagTool
