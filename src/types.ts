export type Bit = 0 | 1
/** 8 bits */
export type Byte = number & { __brand: 'byte' }
/** 16 bits */
export type Word = number & { __brand: 'word' }
/** Bit position within one byte (0-indexed) */
export type BitPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Instruction = {
  readonly name: string,
  readonly args: number,
  cycles: number,
  readonly fn: (param?: any) => void
}