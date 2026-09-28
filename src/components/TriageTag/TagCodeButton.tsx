import { type FunctionComponent } from 'preact'
import { type Code } from '../../algorithm'
import { cx } from '../../utils'
import Icon from '../Icon'

interface TagCodeButtonProps { value: Code, className?: string, title: string, checked: boolean, onClick: (code: Code) => void }

const TagCodeButton: FunctionComponent<TagCodeButtonProps> = ({ value, className, title, checked, onClick }) => {
  const cls = cx(
    'flex flex-col col-span-1 items-center justify-center gap-1 appearance-none transition duration-500 cursor-pointer',
    className
  )

  return (
    <button type="button" value={value} aria-label={title} aria-pressed={checked} className={cls} onClick={() => { onClick(value) }}>
      {checked && <Icon n='check_circle' className='text-3xl leading-none' />}
      <span className='text-xs font-bold text-center leading-tight px-1'>{title}</span>
    </button>
  )
}

export default TagCodeButton
