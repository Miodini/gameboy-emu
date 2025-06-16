import type { Bit, Byte, Word } from './types'

export const int8 = (value: number): Byte => new Int8Array([value])[0] as Byte
export const int16 = (value: number): Word => new Int16Array([value])[0] as Word
export const uint8 = (value: number): Byte => new Uint8Array([value])[0] as Byte
export const uint16 = (value: number): Word => new Uint16Array([value])[0] as Word
/** Asserts `value` is a Bit */
export const bit = (value: number): Bit => value === 0 ? 0 : 1

export const getBit = (value: number, bit: number): Bit => {
  const mask = 1 << bit
  return (value & mask) === 0 ? 0 : 1
}