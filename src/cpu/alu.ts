import type { Bit, BitPosition, Byte, Word } from '../types'
import Registers from './registers'
import Memory from '../memory/memory'
import { bit, int8, int16, uint8, uint16 } from '../utils'

/** Arithmetic Logic Unit */
export default abstract class Alu extends Registers {
    mem = new Memory()
    /* ----- LOGIC OPERATIONS ----- */
    and (value: Byte) {
        this.A &= value
        this.flagZ = this.A === 0
        this.flagN = 0
        this.flagH = 1
        this.flagC = 0
    }
    or (value: Byte) {
        this.A |= value
        this.flagZ = this.A === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = 0  
    }
    xor (value: Byte) {
        this.A ^= value
        this.flagZ = this.A === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = 0
    }
    cp (value: Byte) {
        this.flagZ = this.A - value === 0
        this.flagN = 1
        this.flagH = (this.A & 0x0F) < (value & 0x0F)
        this.flagC = this.A < value
    }
    /* ----- ARITHMETIC OPERATIONS -----*/
    adc (value1: Byte, value2: Byte): void {
        const sum = value1 + value2 + this.flagC

        this.flagZ = sum === 0
        this.flagN = 0
        this.flagH = ((value1 & 0xF) + (value2 & 0xF) + 1 & 0x10) === 0x10
        this.flagC = this.flagC ? uint8(sum) < uint8(value1) : uint8(sum) <= uint8(value1)
        this.A = sum
    }
    add8 (value1: Byte, value2: Byte): void {
        const sum = value1 + value2

        this.flagZ = sum === 0
        this.flagN = 0
        this.flagH = ((value1 & 0xF) + (value2 & 0xF) & 0x10) === 0x10
        this.flagC = uint8(sum) < uint8(value1)
        this.A = sum
    }
    add16 (value1: Word, value2: Word): Word {
        const sum = value1 + value2

        this.flagN = 0
        this.flagH = ((value1 & 0xFF) + (value2 & 0xFF) & 0x100) === 0x100
        this.flagC = uint16(sum) < uint16(value1)

        return int16(sum)
    }
    sub (value: Byte): void {
        this.flagZ = this.A === int8(value)
        this.flagN = 1
        this.flagH = (this.A & 0x0F) < (value & 0x0F)
        this.flagC = this.A < int8(value)
        this.A -= value
    }
    sbc (value: Byte): void {
        const valueWithCarry = int8(value + this.flagC)

        this.flagZ = this.A === valueWithCarry
        this.flagN = 1
        this.flagH = (this.A & 0x0F) < (valueWithCarry & 0x0F)
        this.flagC = this.A < valueWithCarry
        this.A -= valueWithCarry
    }
    dec (value: Byte): Byte {
       this.flagN = 1
       this.flagZ = value === 0x01
       this.flagH = (value & 0x0F) === 0x00

       return int8(value - 1)
    }
    inc (value: Byte): Byte {
       this.flagN = 0
       this.flagZ = value === 0xFF
       this.flagH = (((value & 0xF) + 1) & 0x10) === 0x10

       return int8(value + 1)
    }
    /* ----- ROTATE OPERATIONS ------ */
    rl (value: Byte): Byte {
        const carryBit = value & 0x80
        const result = (value << 1) | this.flagC

        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return int8(result)
    }
    rla (): void {
        const carryBit = this.A & 0x80

        this.A = (this.A << 1) | this.flagC
        this.flagZ = 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)
    }
    rlc (value: Byte): Byte {
        const carryBit = value & 0x80
        const result = (value << 1) | carryBit

        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return int8(result)
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
    rr (value: Byte): Byte {
        const carryBit = value & 0x01
        let result = value >>> 1

        result = this.flagC ? (result | 0x80) : (result & 0x7F)
        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return int8(result)
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
    rrc (value: Byte): Byte {
        const carryBit = value & 0x01
        let result = value >> 1
        
        result = carryBit ? result | 0x80 : result & 0x7F
        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return int8(result)
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
    sla (value: Byte): Byte {
        const carryBit = value & 0x80
        const result = value << 1

        this.flagZ = 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return int8(result)
    }
    sra (value: Byte): Byte {
        const signBit = value & 0x80
        const carryBit = value & 0x01
        let result = (value & 0x7F) >> 1
        
        result = signBit ? result | 0x80 : result & 0x7F
        this.flagZ = result === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return int8(result)
    }
    srl (value: Byte): Byte {
        const carryBit = value & 0x01
        const result = (value >> 1) & 0x7F // reseting bit7 due to JS shift being > 8bit
        
        this.flagZ = value === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = bit(carryBit)

        return int8(result)
    }
    swap (value: Byte): Byte {
        const hNibble = (value & 0xF0) >> 4
        const result = (value << 4) | hNibble

        this.flagZ = value === 0
        this.flagN = 0
        this.flagH = 0
        this.flagC = 0

        return int8(result)
    }
    /* ----- BIT OPERATIONS ----- */
    bit (bit: BitPosition, value: Byte): void {
        this.flagZ = (value & (1 << bit)) ? 0 : 1
        this.flagN = 0
        this.flagH = 1
    }
    set (bit: BitPosition, value: Byte): Byte {
       const result = value | (1 << bit)

       return int8(result)
    }
    res (bit: BitPosition, value: Byte): Byte {
        const result = value & ~(1 << bit)

        return int8(result)
    }
    /* ----- STACK OPERATIONS -----*/
    push (value: Word): void {
        this.mem.store16(value, this.SP)
        this.SP -= 2
    }
    pop (): Word {
        const value = this.mem.load16(this.SP)
        this.SP += 2

        return value
    }
    /* ----- CODE FLOW OPERATIONS ----- */
    call (address: Word): void {
        this.mem.store16(this.PC, this.SP)
        this.SP -= 2
        this.PC = address
    }
    ret (): void {
        this.SP += 2
        this.PC = this.mem.load16(this.SP)
    }
}