import { useRef } from "react"
import { useCanvasController } from "./use-canvas-controller"
import styles from './canvas.module.css'

export function Canvas() {
  const canvasElementRef = useRef<null | HTMLCanvasElement>(null)
  const {message, randomSymbol, handleClearClick, handleCheckClick} = useCanvasController({canvasElementRef})
  const symbolBackgroundImageUrl = randomSymbol ? `url(/images/${randomSymbol}.svg` : 'null'

  return (
    <section>
      <div className={styles.canvasWrapper}>
        <div
          className={styles.canvasBackground}
          style={{
            backgroundImage: `url(/images/lines.svg), ${symbolBackgroundImageUrl})`,
          }}>
        </div>

        <canvas className={styles.canvas} ref={canvasElementRef}></canvas>
      </div>

      <div>
        <button onClick={handleClearClick} type="button">Clear</button>
        <button onClick={handleCheckClick} type="button">Check</button>
      </div>
      
      {message != '' && (<p>{message}</p>)}
    </section>
  )
}