import type { IMemory } from '../memory/types'
import type { Bit, BitPosition, Uint8, Int8, Uint16, Int16 } from '../../types'

export type Instruction = {
  readonly name: string,
  readonly args: number,
  cycles: number,
  // Ideally, fn params should be either undefined, Uint8 or Uint16
  readonly fn: (param?: any) => void
}

export interface IRegisters {
  get flagZ (): Bit
  set flagZ (value: Bit | boolean)

  get flagN (): Bit
  set flagN (value: Bit | boolean)
  
  get flagH (): Bit
  set flagH (value: Bit | boolean)

  get flagC (): Bit
  set flagC (value: Bit | boolean)

  get AF (): Uint16
  set AF (value: number)
  
  get A (): Uint8
  set A (value: number)
  
  get BC (): Uint16
  set BC (value: number)
  
  get B (): Uint8
  set B (value: number)
  
  get C (): Uint8
  set C (value: number)

  get DE (): Uint16
  set DE (value: number)
  
  get D (): Uint8
  set D (value: number)
  
  get E (): Uint8
  set E (value: number)
  
  get HL (): Uint16
  set HL (value: number)

  get H (): Uint8
  set H (value: number)

  get L (): Uint8
  set L (value: number)

  get PC (): Uint16
  set PC (value: number)

  get SP (): Uint16
  set SP (value: number)
}

export interface IAlu extends IRegisters {
  /* ----- LOGIC OPERATIONS ----- */
  and (value: Uint8): void
  or (value: Uint8): void
  xor (value: Uint8): void
  cp (value: Uint8): void
  /* ----- ARITHMETIC OPERATIONS -----*/
  adc (value1: Int8, value2: Int8): void
  add8 (value1: Int8, value2: Int8): void
  add16 (value1: Int16, value2: Int16): Int16
  sub (value: Int8): void
  sbc (value: Int8): void
  dec (value: Int8): Int8
  inc (value: Int8): Int8
  /* ----- ROTATE OPERATIONS ------ */
  rl (value: Uint8): Uint8
  rla (): void
  rlc (value: Uint8): Uint8
  rlca (): void
  rr (value: Uint8): Uint8
  rra (): void
  rrc (value: Uint8): Uint8
  rrca (): void
  sla (value: Uint8): Uint8
  sra (value: Uint8): Uint8
  srl (value: Uint8): Uint8
  swap (value: Uint8): Uint8
  /* ----- BIT OPERATIONS ----- */
  bit (bit: BitPosition, value: Uint8): void
  res (bit: BitPosition, value: Uint8): Uint8
  push (value: Uint16): void
  /* ----- CODE FLOW OPERATIONS ----- */
  call (address: Uint16): void
  ret (): void
  jr (offset: Int8): void
  jp (address: Uint16): void
}

export interface ICpu extends IAlu {
  stopFlag: boolean
  haltFlag: boolean
  interruptEnabled: boolean
  instructions: {[opCode: number]: Instruction}
  execute: () => void
}