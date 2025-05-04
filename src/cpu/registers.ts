import type { Bit, Byte, Word } from "../types"
import { int8, int16 } from "../utils"

export default abstract class Registers {
    // General Purpose Registers
    private reg_af = new Int8Array(2) as Int8Array & { [index: number]: Byte } // A(8) ZNHC0000
    private reg_bc = new Int8Array(2) as Int8Array & { [index: number]: Byte }
    private reg_de = new Int8Array(2) as Int8Array & { [index: number]: Byte }
    private reg_hl = new Int8Array(2) as Int8Array & { [index: number]: Byte }
    // Special
    private pc = new Int8Array(2) as Int8Array & { [index: number]: Byte }
    private sp = new Int8Array(2) as Int8Array & { [index: number]: Byte }

    /** Flags */
    get flagZ (): Bit {
        return (this.reg_af[1] & 0x80) >> 7 ? 1 : 0
    }
    set flagZ (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = int8(value ? F | 0x80 : F & 0x7F)
    }

    get flagN (): Bit {
        return (this.reg_af[1] & 0x40) >> 6 ? 1 : 0
    }
    set flagN (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = int8(value ? F | 0x40 : F & 0xBF)
    }

    get flagH (): Bit {
        return (this.reg_af[1] & 0x20) >> 5 ? 1 : 0
    }
    set flagH (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = int8(value ? F | 0x20 : F & 0xDF)
    }

    get flagC (): Bit {
        return (this.reg_af[1] & 0x10) >> 4 ? 1 : 0
    }
    set flagC (value: Bit | boolean) {
        const F = this.reg_af[1]
        this.reg_af[1] = int8(value ? F | 0x10 : F & 0xEF)
    }

    get AF (): Word {
        return int16(((this.reg_af[0] & 0xFF) << 8) | (this.reg_af[1] & 0xFF))
    }
    set AF (value: number) {
        this.reg_af[0] = int8(value >> 8)
        this.reg_af[1] = int8(value)
    }

    get A (): Byte {
        return this.reg_af[0]
    }
    set A (value: number) {
        this.reg_af[0] = int8(value)
    }

    get BC (): Word {
        return int16(((this.reg_bc[0] & 0xFF) << 8) | (this.reg_bc[1] & 0xFF))
    }
    set BC (value: number) {
        this.reg_bc[0] = int8(value >> 8)
        this.reg_bc[1] = int8(value)
    }

    get B (): Byte {
        return this.reg_bc[0]
    }
    set B (value: number) {
        this.reg_bc[0] = int8(value)
    }

    get C (): Byte {
        return this.reg_bc[1]
    }
    set C (value: number) {
        this.reg_bc[1] = int8(value)
    
    }
    
    get DE (): Word {
        return int16(((this.reg_de[0] & 0xFF) << 8) | (this.reg_de[1] & 0xFF))
    }
    set DE (value: number) {
        this.reg_de[0] = int8(value >> 8)
        this.reg_de[1] = int8(value)
    }

    get D (): Byte {
        return this.reg_de[0]
    }
    set D (value: number) {
        this.reg_de[0] = int8(value)
    }

    get E (): Byte {
        return this.reg_de[1]
    }
    set E (value: number) {
        this.reg_de[1] = int8(value)
    }

    get HL (): Word {
        return int16(((this.reg_hl[0] & 0xFF) << 8) | (this.reg_hl[1] & 0xFF))
    }
    set HL (value: number) {
        this.reg_hl[0] = int8(value >> 8)
        this.reg_hl[1] = int8(value)
    }

    get H (): Byte {
        return this.reg_hl[0]
    }
    set H (value: number) {
        this.reg_hl[0] = int8(value)
    }

    get L (): Byte {
        return this.reg_hl[1]
    }
    set L (value: number) {
        this.reg_hl[1] = int8(value)
    }

    get PC (): Word {
        return int16(((this.pc[0] & 0xFF) << 8) | (this.pc[1] & 0xFF))
    }
    set PC (value: number) {
        this.pc[0] = int8(value >> 8)
        this.pc[1] = int8(value)
    }

    get SP (): Word {
        return int16(((this.sp[0] & 0xFF) << 8) | (this.sp[1] & 0xFF))
    }
    set SP (value: number) {
        this.sp[0] = int8(value >> 8)
        this.sp[1] = int8(value)
    }
}