import { useRef } from "react"

import styles from './canvas.module.css'
import { phrase, useCanvasController } from "./use-canvas-controller"

export function Canvas() {
  const canvasElementRef = useRef<null | HTMLCanvasElement>(null)
  const {
    isLoading,
    message,
    randomSymbol,
    handleClearClick,
    handleCheckClick
  } = useCanvasController({ canvasElementRef })
  const symbolBackgroundImageUrl = randomSymbol?.[0] ? `url(/images/${randomSymbol[0]}.svg` : 'null'

  return (
    <section className={styles.canvasContainer}>
      <div className={styles.canvasWrapper}>
        <div className={styles.description}>
          <p>Symbol: <span className={styles.symbol}>{randomSymbol?.[1].symbol}</span></p>

          <p>Position: <span>{randomSymbol?.[1].position}</span></p>

          <p>Transliteration: <span>{randomSymbol?.[1].translit}</span></p>
        </div>

        <div
          className={styles.canvasBackground}
          style={{
            backgroundImage: `url(/images/lines.svg), ${symbolBackgroundImageUrl})`,
          }}
        >
        </div>

        <canvas className={styles.canvas} ref={canvasElementRef}></canvas>
      </div>

      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${styles.buttonWarning}`}
          disabled={isLoading}
          type="button"
          onClick={handleClearClick}
        >
          Clear
        </button>

        <button
          className={`${styles.button} ${styles.buttonAction}`} disabled={isLoading}
          type="button"
          onClick={handleCheckClick}
        >
          Check
        </button>
      </div>

      {message != '' && (
        <p
          className={`
            ${styles.message}
            ${message === phrase[2] && styles.messageSuccess}
            ${message === phrase[3] && styles.messageWarning}
          `}
        >
          {message}
        </p>
      )}

    </section>
  )
}
