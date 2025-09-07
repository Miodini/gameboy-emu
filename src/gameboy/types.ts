import type { ICpu } from "./cpu/types"
import type { IMemory } from "./memory/types"
import type { IPpu } from "./ppu/types"
export interface IGameBoy {
  cpu: ICpu
  mem: IMemory
  ppu: IPpu
  dump(startAddress: number, endAddress: number): void
  loadRom(romData: Uint8Array): void
  pauseResume(): void
  start(): void
}