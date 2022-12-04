import { MutableRefObject, useEffect, useState } from "react";
import Paper from 'paper'

const symbols = [
  'a_init',
  'e_init',
  'i_init',
  'o_init',
]

interface useCanvasControllerProps {
  canvasElementRef: MutableRefObject<HTMLCanvasElement | null>
}

export function useCanvasController({ canvasElementRef }: useCanvasControllerProps) {
  const [symbolIndex, setSymbolIndex] = useState<null | number>(null)
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClearClick = () => {
    setMessage('')
    Paper.project.activeLayer.removeChildren();
  }

  const handleCheckClick = async () => {
    setIsLoading(true)

    const canvas: null | HTMLCanvasElement = canvasElementRef.current;
    const hasPaths = Paper.project.activeLayer.children.length
    
    if(!hasPaths) {
      setMessage('Start drawing the symbol and then check it out')
    }

    if (canvas && hasPaths) {
      const context = canvas.getContext('2d');

      if (context) {
        const imageData = context.getImageData(0, 0, 2*canvasWidth, 2*canvasHeight);
        invertImageData(imageData)

        context.putImageData(imageData, 0, 0);
      }
    
      const canvasDataUrl = canvas.toDataURL('image/jpeg')
      Paper.project.activeLayer.removeChildren();

      setMessage('Checking...')

      const response = await fetch('/api/file', {
        method: 'POST',
        body: JSON.stringify({
          file: {
            base64: canvasDataUrl,
            fileName: symbolIndex !== null ? symbols[symbolIndex] : null,
          }
        })
      })

      const json = await response.json()
      const { result } = json

      if (result > 0.95) {
        setSymbolIndex((prev) => {
          if (prev == null) {
            return 0
          }

          if (prev + 1 > symbols.length-1) {
            return 0
          }

          return prev + 1
        })
        setMessage('Perfect!')
      } else {
        setMessage('Nice try but it looks different')
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (symbolIndex == null) {
      setSymbolIndex(getRandomInt(0, symbols.length-1))
    }
  }, [symbolIndex])


  const strokeWidth = 12
  const canvasWidth = 400
  const canvasHeight = 400 
  const lineColor = '#000'

  useEffect(() => {
    const canvas: null | HTMLCanvasElement = canvasElementRef.current;

    let path: paper.Path;

    if (canvas && !Paper.view) {
      canvas.style.width = `${canvasWidth}px`
      canvas.style.height = `${canvasHeight}px`

      Paper.setup(canvas)
    }

    if (Paper.view) {
      Paper.view.onMouseDown = (_: paper.MouseEvent) => {
        setMessage('')

        path = new Paper.Path({
          strokeColor: new Paper.Color(lineColor),
          strokeWidth: strokeWidth,
          strokeJoin: 'round',
          strokeCap: 'round',
        });
      }

      Paper.view.onMouseDrag = (event: paper.MouseEvent) => {
        path.add(event.point);
      }

      Paper.view.onMouseUp = (event: paper.MouseEvent) => {
        var segmentCount = path.segments.length;
        
        if (segmentCount == 0) {
          const myCircle = new Paper.Path.Circle(event.point, strokeWidth/2);
          myCircle.fillColor = new Paper.Color(lineColor);
        } else {
          path.simplify();
        }
      }
    }
  }, [canvasElementRef, lineColor])

  return {
    isLoading,
    message,
    randomSymbol: symbolIndex !== null ? symbols[symbolIndex] : null,
    handleClearClick,
    handleCheckClick
  }
}

function getRandomInt(min: number, max: number) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function invertImageData(imageData: ImageData): ImageData {
  const {data} = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i]
    const green = data[i + 1]
    const blue = data[i + 2]
    const alpha = data[i + 3]

    if (alpha === 0) {
      // convert transparent to black
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255
    } else {
      // invert
      data[i] = 255 - red;
      data[i + 1] = 255 - green;
      data[i + 2] = 255 - blue;
    }
  }

  return imageData
}
