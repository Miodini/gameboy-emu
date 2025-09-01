import type { IAlu } from './types'
import type { IMemory } from '../memory/types'
import type { BitPosition, Int8, Uint8, Int16, Uint16 } from '../../types'
import Registers from './registers'
import { bit, int8, int16, uint8, uint16 } from '../../utils'

/** Arithmetic Logic Unit */
export default abstract class Alu extends Registers implements IAlu {
    constructor (protected mem: IMemory) {
        super()
    }
    /* ----- LOGIC OPERATIONS ----- */
    and (value: Uint8): void {
        this.A &= value
        this.flagZ = this.A === 0
        this.flagN = 0
        this.flagH = 1
        this.flagC = 0
    }
    or (value: Uint8): void {
        this.A |= value
        this.flagZ = this.A === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = 0  
    }
    xor (value: Uint8): void {
        this.A ^= value
        this.flagZ = this.A === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = 0
    }
    cp (value: Uint8): void {
        this.flagZ = this.A === value
        this.flagN = 1
        this.flagH = (this.A & 0x0F) < (value & 0x0F)
        this.flagC = this.A < value
    }
    /* ----- ARITHMETIC OPERATIONS -----*/
    adc (value1: Int8, value2: Int8): void {
        const sum = value1 + value2 + this.flagC

        this.flagZ = sum === 0
        this.flagN = 0
        this.flagH = ((value1 & 0xF) + (value2 & 0xF) + 1 & 0x10) === 0x10
        this.flagC = this.flagC ? uint8(sum) < uint8(value1) : uint8(sum) <= uint8(value1)
        this.A = sum
    }
    add8 (value1: Int8, value2: Int8): void {
        const sum = value1 + value2

        this.flagZ = sum === 0
        this.flagN = 0
        this.flagH = ((value1 & 0xF) + (value2 & 0xF) & 0x10) === 0x10
        this.flagC = uint8(sum) < uint8(value1)
        this.A = sum
    }
    add16 (value1: Int16, value2: Int16): Int16 {
        const sum = value1 + value2

        this.flagN = 0
        this.flagH = ((value1 & 0xFF) + (value2 & 0xFF) & 0x100) === 0x100
        this.flagC = uint16(sum) < uint16(value1)

        return int16(sum)
    }
    sub (value: Int8): void {
        this.flagZ = int8(this.A) === value
        this.flagN = 1
        this.flagH = (this.A & 0x0F) < (value & 0x0F)
        this.flagC = this.A < int8(value)
        this.A = int8(this.A) - value
    }
    sbc (value: Int8): void {
        const valueWithCarry = int8(value + this.flagC)

        this.flagZ = int8(this.A) === valueWithCarry
        this.flagN = 1
        this.flagH = (this.A & 0x0F) < (valueWithCarry & 0x0F)
        this.flagC = this.A < valueWithCarry
        this.A -= valueWithCarry
    }
    dec (value: Int8): Int8 {
       this.flagN = 1
       this.flagZ = value === 0x01
       this.flagH = (value & 0x0F) === 0x00

       return int8(value - 1)
    }
    inc (value: Int8): Int8 {
       this.flagN = 0
       this.flagZ = value === 0xFF
       this.flagH = (((value & 0xF) + 1) & 0x10) === 0x10

       return int8(value + 1)
    }
    /* ----- ROTATE OPERATIONS ------ */
    rl (value: Uint8): Uint8 {
        const carryBit = value & 0x80
        const result = (value << 1) | this.flagC

        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return uint8(result)
    }
    rla (): void {
        const carryBit = this.A & 0x80

        this.A = (this.A << 1) | this.flagC
        this.flagZ = 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)
    }
    rlc (value: Uint8): Uint8 {
        const carryBit = value & 0x80
        const result = (value << 1) | carryBit

        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return uint8(result)
    }
    rlca (): void {
        const carryBit = this.A & 0x80

        this.A <<= 1
        this.A |= carryBit // 0x00 or 0x01
        this.flagZ = 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)
    }
    rr (value: Uint8): Uint8 {
        const carryBit = value & 0x01
        let result = value >>> 1

        result = this.flagC ? (result | 0x80) : (result & 0x7F)
        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return uint8(result)
    }
    rra (): void {
        const carryBit = this.A & 0x01

        this.A >>= 1
        this.A = this.flagC ? this.A | 0x80 : this.A & 0x7F
        this.flagZ = 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)
    }
    rrc (value: Uint8): Uint8 {
        const carryBit = value & 0x01
        let result = value >> 1
        
        result = carryBit ? result | 0x80 : result & 0x7F
        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return uint8(result)
    }
    rrca (): void {
        const carryBit = this.A & 0x01
        
        this.A >>= 1
        this.A = carryBit ? this.A | 0x80 : this.A & 0x7F
        this.flagZ = 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)
    }
    sla (value: Uint8): Uint8 {
        const carryBit = value & 0x80
        const result = value << 1

        this.flagZ = 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return uint8(result)
    }
    sra (value: Uint8): Uint8 {
        const signBit = value & 0x80
        const carryBit = value & 0x01
        let result = (value & 0x7F) >> 1
        
        result = signBit ? result | 0x80 : result & 0x7F
        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return uint8(result)
    }
    srl (value: Uint8): Uint8 {
        const carryBit = value & 0x01
        const result = (value >> 1) & 0x7F // reseting bit7 due to JS shift being > 8bit
        
        this.flagZ = value === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return uint8(result)
    }
    swap (value: Uint8): Uint8 {
        const hNibble = (value & 0xF0) >> 4
        const result = (value << 4) | hNibble

        this.flagZ = value === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = 0

        return uint8(result)
    }
    /* ----- BIT OPERATIONS ----- */
    bit (bit: BitPosition, value: Uint8): void {
        this.flagZ = (value & (1 << bit)) ? 0 : 1
        this.flagN = 0
        this.flagH = 1
    }
    set (bit: BitPosition, value: Uint8): Uint8 {
       const result = value | (1 << bit)

       return uint8(result)
    }
    res (bit: BitPosition, value: Uint8): Uint8 {
        const result = value & ~(1 << bit)

        return uint8(result)
    }
    /* ----- STACK OPERATIONS -----*/
    push (value: Uint16): void {
        this.SP -= 2
        this.mem.store16(value, this.SP)
    }
    pop (): Uint16 {
        const value = this.mem.load16(this.SP)
        this.SP += 2

        return value
    }
    /* ----- CODE FLOW OPERATIONS ----- */
    call (address: Uint16): void {
        this.SP -= 2
        this.mem.store16(this.PC, this.SP)
        this.PC = address
    }
    ret (): void {
        this.PC = this.mem.load16(this.SP)
        this.SP += 2
    }
    jr (offset: Int8): void {
        this.PC += offset
    }
    jp (address: Uint16): void {
        this.PC = address
    }
}