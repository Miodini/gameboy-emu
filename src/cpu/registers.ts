import type { Bit, Uint8, Uint16 } from "../types"
import { uint8, uint16 } from "../utils"

export default abstract class Registers {
    // General Purpose Registers
    private reg_af = new Int8Array(2) // A(8) ZNHC0000
    private reg_bc = new Int8Array(2)
    private reg_de = new Int8Array(2)
    private reg_hl = new Int8Array(2)
    // Special
    private pc = new Int8Array(2)
    private sp = new Int8Array(2)

    /** Flags */
    get flagZ (): Bit {
        return (this.reg_af[1] & 0x80) >> 7 ? 1 : 0
    }
    set flagZ (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = uint8(value ? F | 0x80 : F & 0x7F)
    }

    get flagN (): Bit {
        return (this.reg_af[1] & 0x40) >> 6 ? 1 : 0
    }
    set flagN (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = uint8(value ? F | 0x40 : F & 0xBF)
    }

    get flagH (): Bit {
        return (this.reg_af[1] & 0x20) >> 5 ? 1 : 0
    }
    set flagH (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = uint8(value ? F | 0x20 : F & 0xDF)
    }

    get flagC (): Bit {
        return (this.reg_af[1] & 0x10) >> 4 ? 1 : 0
    }
    set flagC (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = uint8(value ? F | 0x10 : F & 0xEF)
    }

    get AF (): Uint16 {
        return uint16(((this.reg_af[0] & 0xFF) << 8) | (this.reg_af[1] & 0xFF))
    }
    set AF (value: number) {
        this.reg_af[0] = uint8(value >> 8)
        this.reg_af[1] = uint8(value)
    }

    get A (): Uint8 {
        return uint8(this.reg_af[0])
    }
    set A (value: number) {
        this.reg_af[0] = uint8(value)
    }

    get BC (): Uint16 {
        return uint16(((this.reg_bc[0] & 0xFF) << 8) | (this.reg_bc[1] & 0xFF))
    }
    set BC (value: number) {
        this.reg_bc[0] = uint8(value >> 8)
        this.reg_bc[1] = uint8(value)
    }

    get B (): Uint8 {
        return uint8(this.reg_bc[0])
    }
    set B (value: number) {
        this.reg_bc[0] = uint8(value)
    }

    get C (): Uint8 {
        return uint8(this.reg_bc[1])
    }
    set C (value: number) {
        this.reg_bc[1] = uint8(value)
    
    }
    
    get DE (): Uint16 {
        return uint16(((this.reg_de[0] & 0xFF) << 8) | (this.reg_de[1] & 0xFF))
    }
    set DE (value: number) {
        this.reg_de[0] = uint8(value >> 8)
        this.reg_de[1] = uint8(value)
    }

    get D (): Uint8 {
        return uint8(this.reg_de[0])
    }
    set D (value: number) {
        this.reg_de[0] = uint8(value)
    }

    get E (): Uint8 {
        return uint8(this.reg_de[1])
    }
    set E (value: number) {
        this.reg_de[1] = uint8(value)
    }

    get HL (): Uint16 {
        return uint16(((this.reg_hl[0] & 0xFF) << 8) | (this.reg_hl[1] & 0xFF))
    }
    set HL (value: number) {
        this.reg_hl[0] = uint8(value >> 8)
        this.reg_hl[1] = uint8(value)
    }

    get H (): Uint8 {
        return uint8(this.reg_hl[0])
    }
    set H (value: number) {
        this.reg_hl[0] = uint8(value)
    }

    get L (): Uint8 {
        return uint8(this.reg_hl[1])
    }
    set L (value: number) {
        this.reg_hl[1] = uint8(value)
    }

    get PC (): Uint16 {
        return uint16(((this.pc[0] & 0xFF) << 8) | (this.pc[1] & 0xFF))
    }
    set PC (value: number) {
        this.pc[0] = uint8(value >> 8)
        this.pc[1] = uint8(value)
    }

    get SP (): Uint16 {
        return uint16(((this.sp[0] & 0xFF) << 8) | (this.sp[1] & 0xFF))
    }
    set SP (value: number) {
        this.sp[0] = uint8(value >> 8)
        this.sp[1] = uint8(value)
    }

    constructor () {
        // Emulates the boot rom process
        this.AF = 0x01B0
        this.BC = 0x0013
        this.DE = 0x00D8
        this.HL = 0x014D
        this.SP = 0xFFFE
        this.PC = 0x0100
    }
}