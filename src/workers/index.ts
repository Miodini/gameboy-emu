import Memory from '../memory'
import Ppu from '../ppu'
import Cpu from '../cpu'
import { WorkerTypes as WT } from '../types'

const mem = new Memory()
const cpu = new Cpu(mem)

const onLoad = (canvas: OffscreenCanvas, romData: Uint8Array, pixelSize: number) => {
  const ppu = new Ppu(mem, canvas, pixelSize)

  // Handle the Load message type
  cpu.mem.rom = romData
  setInterval(() => {
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    ppu.draw()
  }, 5)
}

const onDump = (startAddress: number, endAddress: number) => {
  console.log(mem.memory.subarray(startAddress, endAddress))
}

const onPause = () => {
  cpu.haltFlag = !cpu.haltFlag
}

onmessage = (event: MessageEvent<WT.WorkerMessage>) => {
  const { messageType } = event.data

  switch (messageType) {
    case WT.MessageType.Dump: {
      const { startAddress, endAddress } = event.data.payload
      
      onDump(startAddress, endAddress)
      break
    }
    case WT.MessageType.Load: {
      const { canvas, romData, pixelSize } = event.data.payload

      onLoad(canvas, romData, pixelSize)
      break
    }
    case WT.MessageType.Pause: {
      onPause()
      break
    }
  }
}