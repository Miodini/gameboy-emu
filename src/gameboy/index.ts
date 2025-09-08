import type { ICpu } from './cpu/types'
import type { IMemory } from './memory/types'
import type { IPpu } from './ppu/types'
import type { IGameBoy } from './types'

import Memory from './memory'
import Cpu from './cpu'
import Ppu from './ppu'
import { getBit } from '../utils'

export default class GameBoy implements IGameBoy {
  public readonly cpu: ICpu
  public readonly mem: IMemory
  public readonly ppu: IPpu

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

  private getTacTimerFrequency(): number {
    let timerFrequency: number

    switch (this.mem.TAC & 0x3) {
    case 0:
      timerFrequency = 4096
      break
    case 1:
      timerFrequency = 262144
      break
    case 2:
      timerFrequency = 65536
      break
    case 3:
    default:
      timerFrequency = 16384
      break
    }

    return timerFrequency
  }

  public start(): void {
    /* Clocks In Hz */
    const mainClock = 4194304
    const divClock = 16384
    const cyclesPerScanline = 456

    let divClockCounter: number = divClock

    /**
     * This function emulates 1 second of the hardware running. It:
     * - Checks for interrupts and handles them if applicable
     * - Run instructions
     * - Draws scanlines
     * - Updates the TIMA timer
     * - Updates the DIV timer
     */
    const oneSecondRun = () => {
      let cpuCyclesCounter: number = 0

      for (let i = 0; i < mainClock; i++) {
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

        if (i % cyclesPerScanline === 0) {
          this.ppu.drawScanLine()
        }
        
        if (getBit(this.mem.TAC, 2)) {
          const tacTimerFrequency = this.getTacTimerFrequency()
  
          if (i % tacTimerFrequency === 0) {
            this.mem.TIMA++
          }
        }
        /* DIV register is increased at 16384Hz */
        divClockCounter--
        if (divClockCounter === 0 && !this.cpu.stopFlag) {
          this.mem.DIV++
          divClockCounter = divClock
        }
      }
    }

    this.timeoutHandler = setInterval(oneSecondRun, 1000)
  }

  public stop() {
    clearTimeout(this.timeoutHandler)
  }
}