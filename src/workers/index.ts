import type { IGameBoy } from '../gameboy/types'
import GameBoy from '../gameboy/gameboy'
import { WorkerTypes as WT } from '../types'

let gameBoy: IGameBoy

const onInit = (canvas: OffscreenCanvas, pixelSize: number) => {
  gameBoy = new GameBoy(canvas, pixelSize)
}

const onLoad = (romData: Uint8Array) => {
  gameBoy.loadRom(romData)
  gameBoy.start()
}

const onDump = (startAddress: number, endAddress: number) => {
  gameBoy.dump(startAddress, endAddress)
}

const onPause = () => {
  gameBoy.pauseResume()
}

onmessage = (event: MessageEvent<WT.WorkerMessage>) => {
  const { messageType } = event.data

  switch (messageType) {
    case WT.MessageType.Init: {
      const { canvas, pixelSize } = event.data.payload

      onInit(canvas, pixelSize)
      break
    }
    case WT.MessageType.Dump: {
      const { startAddress, endAddress } = event.data.payload
      
      onDump(startAddress, endAddress)
      break
    }
    case WT.MessageType.Load: {
      const { romData } = event.data.payload

      onLoad(romData)
      break
    }
    case WT.MessageType.Pause: {
      onPause()
      break
    }
  }
}