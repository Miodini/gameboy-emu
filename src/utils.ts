import type { Bit, Int8, Uint8, Int16, Uint16 } from './types'

export const int8 = (value: number): Int8 => new Int8Array([value])[0] as Int8
export const uint8 = (value: number): Uint8 => new Uint8Array([value])[0] as Uint8
export const int16 = (value: number): Int16 => new Int16Array([value])[0] as Int16
export const uint16 = (value: number): Uint16 => new Uint16Array([value])[0] as Uint16
/** Asserts `value` is a Bit */
export const bit = (value: number): Bit => value === 0 ? 0 : 1

export const getBit = (value: number, bit: number): Bit => {
  const mask = 1 << bit
  return (value & mask) === 0 ? 0 : 1
}