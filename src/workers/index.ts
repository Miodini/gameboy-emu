import Memory from '../memory'
import Ppu from '../ppu'
import Cpu from '../cpu'
import { WorkerTypes as WT } from '../types'

const mem = new Memory()

const onLoad = (canvas: OffscreenCanvas, romData: Int8Array, pixelSize: number) => {
  const cpu = new Cpu(mem)
  const ppu = new Ppu(mem, canvas, pixelSize)

  // Handle the Load message type
  cpu.mem.rom = romData
  setInterval(() => {
    cpu.execute()
    cpu.execute()
    cpu.execute()
    cpu.execute()
    ppu.draw()
  }, 1)
}

const onDump = (startAddress: number, endAddress: number) => {
  console.log(mem.memory.subarray(startAddress, endAddress))
}

onmessage = (event: MessageEvent<WT.WorkerMessage>) => {
  const { messageType } = event.data

  switch (messageType) {
  case WT.MessageType.Dump: {
    const { startAddress, endAddress } = event.data.payload
    
    console.log('dump')
    onDump(startAddress, endAddress)
    break
  }
  case WT.MessageType.Load:
    const { canvas, romData, pixelSize } = event.data.payload

    onLoad(canvas, romData, pixelSize)
    break
  }
}