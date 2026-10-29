import { Component, type ReactNode } from 'react'
import { book } from '@/config/book.ts'
import { buttonClassName } from '@/shared/ui/buttonClass.ts'
import styles from './StatusPage.module.css'

type Props = { children: ReactNode }
type State = { message: string | null }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { message: null }

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message }
  }

  render() {
    if (!this.state.message) return this.props.children
    return (
      <div className={styles.page}>
        <p className={styles.kicker}>{book.title}</p>
        <h1 className={styles.title}>Не удалось открыть книгу</h1>
        <p className={styles.text}>{this.state.message}</p>
        <button
          type="button"
          className={buttonClassName('primary')}
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>
    )
  }
}
