import { Link } from 'react-router'
import { book } from '@/config/book.ts'
import { buttonClassName } from '@/shared/ui/index.ts'
import styles from './StatusPage.module.css'

type Props = {
  title: string
  text: string
}

export function StatusPage({ title, text }: Props) {
  return (
    <div className={styles.page}>
      <p className={styles.kicker}>{book.title}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{text}</p>
      <Link to="/" className={buttonClassName('primary')}>
        На обложку
      </Link>
    </div>
  )
}
