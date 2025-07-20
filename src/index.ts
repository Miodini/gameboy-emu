import { WorkerTypes as WT } from './types'
import { Sizes } from './ppu/constants'
import { startMemoryDumper } from './memory/dumper'

const fileInput = document.getElementById('fileInput') as HTMLInputElement
const canvas = document.createElement('canvas')
const PIXEL_SIZE = 5
const worker = new Worker(new URL('./workers', import.meta.url))

const initializeHtml = () => {
  canvas.width = Sizes.VISIBLE_SCREEN_WIDTH * PIXEL_SIZE
  canvas.height = Sizes.VISIBLE_SCREEN_HEIGHT * PIXEL_SIZE
  
  document.getElementById('screen')?.appendChild(canvas)
  startMemoryDumper(worker)
}

initializeHtml()

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0]
    const reader = new FileReader()
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const fileContent = new Int8Array(reader.result)
        const offscreenCanvas = canvas.transferControlToOffscreen()
        const messagePayload: WT.LoadMessagePayload = {
          romData: fileContent,
          canvas: offscreenCanvas,
          pixelSize: PIXEL_SIZE
        }

        worker.postMessage({
          messageType: WT.MessageType.Load,
          payload: messagePayload
        }, [offscreenCanvas])
      }
    }
    reader.readAsArrayBuffer(file)
  }
})