export interface IGameBoy {
  dump(startAddress: number, endAddress: number): void
  loadRom(romData: Uint8Array): void
  pauseResume(): void
  start(): void
}