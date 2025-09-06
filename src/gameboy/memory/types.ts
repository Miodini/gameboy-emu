import type { Uint8, Uint16 } from '../../types'

export interface IMemory {
  memory: Uint8Array
  load8(address: Uint16): Uint8
  load16(address: Uint16): Uint16
  store8(value: number, address: Uint16): void
  store16(value: Uint16, address: Uint16): void
  
  get rom (): Uint8Array
  set rom (value: Uint8Array)

  get P1JOYP (): Uint8
  set P1JOYP(value: number)

  get SB (): Uint8
  set SB(value: number)

  get SC (): Uint8
  set SC(value: number)

  get DIV (): Uint8
  set DIV(value: number)

  get TIMA (): Uint8
  set TIMA(value: number)

  get TMA (): Uint8
  set TMA(value: number)

  get TAC (): Uint8
  set TAC(value: number)

  get IF (): Uint8
  set IF(value: number)

  get NR10 (): Uint8
  set NR10(value: number)

  get NR11 (): Uint8
  set NR11(value: number)

  get NR12 (): Uint8
  set NR12(value: number)

  get NR13 (): Uint8
  set NR13(value: number)

  get NR14 (): Uint8
  set NR14(value: number)

  get NR21 (): Uint8
  set NR21(value: number)

  get NR22 (): Uint8
  set NR22(value: number)

  get NR23 (): Uint8
  set NR23(value: number)

  get NR24 (): Uint8
  set NR24(value: number)

  get NR30 (): Uint8
  set NR30(value: number)

  get NR31 (): Uint8
  set NR31(value: number)

  get NR32 (): Uint8
  set NR32(value: number)

  get NR33 (): Uint8
  set NR33(value: number)

  get NR34 (): Uint8
  set NR34(value: number)

  get NR41 (): Uint8
  set NR41(value: number)

  get NR42 (): Uint8
  set NR42(value: number)

  get NR43 (): Uint8
  set NR43(value: number)

  get NR44 (): Uint8
  set NR44(value: number)

  get NR50 (): Uint8
  set NR50(value: number)

  get NR51 (): Uint8
  set NR51(value: number)

  get NR52 (): Uint8
  set NR52(value: number)

  get LCDC (): Uint8
  set LCDC(value: number)

  get STAT (): Uint8
  set STAT(value: number)

  get SCY (): Uint8
  set SCY(value: number)

  get SCX (): Uint8
  set SCX(value: number)

  get LY (): Uint8
  set LY(value: number)

  get LYC (): Uint8
  set LYC(value: number)

  get DMA (): Uint8
  set DMA(value: number)

  get BGP (): Uint8
  set BGP(value: number)

  get OBP0 (): Uint8
  set OBP0(value: number)

  get OBP1 (): Uint8
  set OBP1(value: number)

  get WY (): Uint8
  set WY(value: number)

  get WX (): Uint8
  set WX(value: number)

  get IE (): Uint8
  set IE(value: number)
}