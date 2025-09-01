import type { ICpu } from './cpu/types'
import type { IMemory } from './memory/types'
import type { IPpu } from './ppu/types'
import type { IGameBoy } from './types'

import Memory from './memory'
import Cpu from './cpu'
import Ppu from './ppu'

export default class GameBoy implements IGameBoy {
  private cpu: ICpu
  private mem: IMemory
  private ppu: IPpu

  constructor(canvas: OffscreenCanvas, pixelSize: number) {
    this.mem = new Memory()
    this.cpu = new Cpu(this.mem)
    this.ppu = new Ppu(this.mem, canvas, pixelSize)
  }

  public dump(startAddress: number, endAddress: number): void {
    console.log(this.mem.memory.subarray(startAddress, endAddress))
  }

  public loadRom(romData: Uint8Array): void {
    this.mem.rom = romData
  }

  public pauseResume(): void {
    this.cpu.haltFlag = !this.cpu.haltFlag
  }

  public start(): void {
    setInterval(() => {
      for (let i = 0; i < 30; i++) {
        this.cpu.execute()
      }
      this.ppu.draw()
    }, 5)
  }
}