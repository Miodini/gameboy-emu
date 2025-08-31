import { WorkerTypes as WT } from './types'
import { Sizes } from './ppu/constants'
import { startMemoryDumper } from './memory/dumper'

const PIXEL_SIZE = 5
const fileInput = document.getElementById('fileInput') as HTMLInputElement
const canvas = document.createElement('canvas')
const worker = new Worker(new URL('./workers', import.meta.url))
let isPaused = false

const initializeHtml = () => {
  const pauseButton = document.getElementById('pause') as HTMLButtonElement

  pauseButton.addEventListener('click', () => {
    worker.postMessage({
      messageType: WT.MessageType.Pause
    })

    isPaused = !isPaused
    pauseButton.innerHTML = isPaused
      ? '<span class="material-symbols-outlined">play_arrow</span>'
      : '<span class="material-symbols-outlined">pause</span>'
  })

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
        const fileContent = new Uint8Array(reader.result)
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