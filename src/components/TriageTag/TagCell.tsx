import { type FunctionComponent, type PropsWithChildren } from 'preact/compat'
import { cx } from '../../utils'

type TagCellProps = PropsWithChildren<{ span?: number, title: string, wrap?: boolean }>

const TagCell: FunctionComponent<TagCellProps> = ({ children, span, title, wrap }) => {
  const cls = cx(
    'p-2 lg:px-3',
    !wrap && 'overflow-hidden text-ellipsis whitespace-nowrap',
    `col-span-${span ?? 12}`
  )

  return (
    <div className={cls}>
      <p className="text-base text-black opacity-50">{title}</p>
      <div className="text-2xl md:text-3xl font-bold">{children}</div>
    </div>
  )
}

export default TagCell
