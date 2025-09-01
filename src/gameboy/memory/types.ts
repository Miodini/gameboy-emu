import type { Uint8, Uint16 } from '../../types'

export interface IMemory {
  memory: Uint8Array
  load8(address: Uint16): Uint8
  load16(address: Uint16): Uint16
  store8(value: Uint8, address: Uint16): void
  store16(value: Uint16, address: Uint16): void
  
  get rom (): Uint8Array
  set rom (value: Uint8Array)

  get P1JOYP ()
  set P1JOYP(value: Uint8)

  get SB ()
  set SB(value: Uint8)

  get SC ()
  set SC(value: Uint8)

  get DIV ()
  set DIV(value: Uint8)

  get TIMA ()
  set TIMA(value: Uint8)

  get TMA ()
  set TMA(value: Uint8)

  get TAC ()
  set TAC(value: Uint8)

  get IF ()
  set IF(value: Uint8)

  get NR10 ()
  set NR10(value: Uint8)

  get NR11 ()
  set NR11(value: Uint8)

  get NR12 ()
  set NR12(value: Uint8)

  get NR13 ()
  set NR13(value: Uint8)

  get NR14 ()
  set NR14(value: Uint8)

  get NR21 ()
  set NR21(value: Uint8)

  get NR22 ()
  set NR22(value: Uint8)

  get NR23 ()
  set NR23(value: Uint8)

  get NR24 ()
  set NR24(value: Uint8)

  get NR30 ()
  set NR30(value: Uint8)

  get NR31 ()
  set NR31(value: Uint8)

  get NR32 ()
  set NR32(value: Uint8)

  get NR33 ()
  set NR33(value: Uint8)

  get NR34 ()
  set NR34(value: Uint8)

  get NR41 ()
  set NR41(value: Uint8)

  get NR42 ()
  set NR42(value: Uint8)

  get NR43 ()
  set NR43(value: Uint8)


  get NR44 ()
  set NR44(value: Uint8)

  get NR50 ()
  set NR50(value: Uint8)

  get NR51 ()
  set NR51(value: Uint8)

  get NR52 ()
  set NR52(value: Uint8)

  get LCDC ()
  set LCDC(value: Uint8)

  get STAT ()
  set STAT(value: Uint8)

  get SCY ()
  set SCY(value: Uint8)

  get SCX ()
  set SCX(value: Uint8)

  get LY ()
  set LY(value: Uint8)

  get LYC ()
  set LYC(value: Uint8)

  get DMA ()
  set DMA(value: Uint8)

  get BGP ()
  set BGP(value: Uint8)

  get OBP0 ()
  set OBP0(value: Uint8)

  get OBP1 ()
  set OBP1(value: Uint8)

  get WY ()
  set WY(value: Uint8)

  get WX ()
  set WX(value: Uint8)

  get IE ()
  set IE(value: Uint8)
}