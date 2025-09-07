import type { ICpu } from './cpu/types'
import type { IMemory } from './memory/types'
import type { IPpu } from './ppu/types'
import type { IGameBoy } from './types'

import Memory from './memory'
import Cpu from './cpu'
import Ppu from './ppu'

export default class GameBoy implements IGameBoy {
  public readonly cpu: ICpu
  public readonly mem: IMemory
  public readonly ppu: IPpu
  /** In Hz */
  private readonly clock: number = 4194304
  private readonly cyclesPerScanline = 456
  private timeoutHandler?: NodeJS.Timeout

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
    const oneSecondRun = () => {
      let cpuCyclesCounter: number = 0

      for (let i = 0; i < this.clock; i++) {
        /* Each cpu instruction will be run fully during one clock cycle,
         * and no activity will happen on the CPU for the remaining cycles
         */
        if (cpuCyclesCounter === 0) {
          /* Check for interruptions before executing normal code flow. This takes 5 clock cycles */
          if (this.cpu.checkForInterrupts()) {
            cpuCyclesCounter = 5
            continue
          }
          cpuCyclesCounter = this.cpu.execute()
        } else {
          cpuCyclesCounter--
        }

        if (i % this.cyclesPerScanline === 0) {
          this.ppu.drawScanLine()
        }
      }
    }

    this.timeoutHandler = setInterval(oneSecondRun, 1000)
  }

  public stop() {
    clearTimeout(this.timeoutHandler)
  }
}