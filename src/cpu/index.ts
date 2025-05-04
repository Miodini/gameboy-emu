import type { Byte, Word, Instruction } from '../types'
import Alu from "./alu.js"
import { int8, uint8, int16 } from '../utils'

export default class Cpu extends Alu {
    stopFlag = false // Not related to the hardware. Tells whether the emulator should stop executing code
    haltFlag = false // // Not related to the hardware. Used by the HALT instruction
    interruptEnabled = true

    /**
     * NOTE: The cycles counter may be modified by the instruction itself, so evaluate that after
     * the instruction is run
     */
    instructions: {[opCode: number]: Instruction} = {
        0x00: {
            name: 'NOP',
            args: 0,
            cycles: 4,
            fn: () => null
        },
        0x01: {
            name: 'LD BC,d16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => this.BC = word
        },
        0x02: {
            name: 'LD (BC),A',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.A, this.BC)
        },
        0x03: {
            name: 'INC BC',
            args: 0,
            cycles: 8,
            fn: () => this.BC++
        },
        0x04: {
            name: 'INC B',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.inc(this.B)
        },
        0x05: {
            name: 'DEC B',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.dec(this.B)
        },
        0x06: {
            name: 'LD B,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.B = byte 
        },
        0x07: {
            name: 'RLCA',
            args: 0,
            cycles: 4,
            fn: () => this.rlca()
        },
        0x08: {
            name: 'LD (a16),SP',
            args: 2,
            cycles: 20,
            fn: (word: Word) => this.mem.store16(this.SP, word)
        },
        0x09: {
            name: 'ADD HL,BC',
            args: 0,
            cycles: 8,
            fn: () => this.HL = this.add16(this.HL, this.BC)
        },
        0x0A: {
            name: 'LD A,(BC)',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.mem.load8(this.BC)
        },
        0x0B: {
            name: 'DEC BC',
            args: 0,
            cycles: 8,
            fn: () => this.BC--
        },
        0x0C: {
            name: 'INC C',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.inc(this.C)
        },
        0x0D: {
            name: 'DEC C',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.dec(this.C)
        },
        0x0E: {
            name: 'LD C,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.C = byte 
        },
        0x0F: {
            name: 'RRCA',
            args: 0,
            cycles: 4,
            fn: () => this.rrca()
        },
        0x10: {
            name: 'STOP 0',
            // Opcode is 2 byte-long
            args: 1,
            cycles: 4,
            fn: () => this.stopFlag = true
        },
        0x11: {
            name: 'LD DE,d16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => this.DE = word
        },
        0x12: {
            name: 'LD (DE),A',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.A, this.DE)
        },
        0x13: {
            name: 'INC DE',
            args: 0,
            cycles: 8,
            fn: () => this.DE++
        },
        0x14: {
            name: 'INC D',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.inc(this.D)
        },
        0x15: {
            name: 'DEC D',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.dec(this.D)
        },
        0x16: {
            name: 'LD D,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.D = byte 
        },
        0x17: {
            name: 'RLA',
            args: 0,
            cycles: 4,
            fn: () => this.rla()
        },
        0x18: {
            name: 'JR r8',
            args: 1,
            cycles: 12,
            fn: (byte: Byte) => this.PC += byte
        },
        0x19: {
            name: 'ADD HL,DE',
            args: 0,
            cycles: 8,
            fn: () => {
                this.HL = this.add16(this.HL, this.DE)
            }
        },
        0x1A: {
            name: 'LD A,(DE)',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.mem.load8(this.DE)
        },
        0x1B: {
            name: 'DEC DE',
            args: 0,
            cycles: 8,
            fn: () => this.DE--
        },
        0x1C: {
            name: 'INC E',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.inc(this.E)
        },
        0x1D: {
            name: 'DEC E',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.dec(this.E)
        },
        0x1E: {
            name: 'LD E,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.E = byte 
        },
        0x1F: {
            name: 'RRA',
            args: 0,
            cycles: 4,
            fn: () => this.rra()
        },
        0x20: {
            name: 'JR NZ,r8',
            args: 2,
            cycles: 8,
            fn: (byte: Byte) => {
                if (!this.flagZ) {
                    this.PC += byte
                    this.instructions[0x20].cycles = 12
                } else {
                    this.instructions[0x20].cycles = 8
                }
            }
        },
        0x21: {
            name: 'LD HL,d16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => this.HL = word
        },
        0x22: {
            name: 'LD (HL+),A',
            args: 0,
            cycles: 8,
            fn: () => {
                this.HL += 1
                this.mem.store8(this.A, this.HL)
            }
        },
        0x23: {
            name: 'INC HL',
            args: 0,
            cycles: 8,
            fn: () => this.HL++
        },
        0x24: {
            name: 'INC H',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.inc(this.H)
        },
        0x25: {
            name: 'DEC H',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.dec(this.H)
        },
        0x26: {
            name: 'LD H,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.H = byte 
        },
        0x27: {
            // Intended to be run after a BCD arithmetic instruction
            name: 'DAA',
            args: 0,
            cycles: 4,
            fn: () => {
                // const highNibble = this.A & 0xF0
                // const lowNibble = this.A & 0x0F
                // if (this.flagC) {
                //     if (this.flagH) {
                //         // C, H
                //         if (
                //             (
                //                 0 <= highNibble && highNibble <= 3 &&
                //                 0 <= lowNibble && lowNibble <= 3
                //             ) || (
                //                 6 <= highNibble && highNibble <= 7 &&
                //                 6 <= lowNibble && lowNibble <= 0x0F
                //             )
                //         ) {
                //             this.A += 0x66
                //         }
                //     } else {
                //         // C, !H
                //         if (0 <= highNibble && highNibble <= 2 &&
                //             0 <= lowNibble && lowNibble <= 9    
                //         ) {
                //             this.A += 0x60
                //         } else if (0 <= highNibble && highNibble <= 2 &&
                //             0xA <= lowNibble && lowNibble <= 0xF
                //         ) {
                //             this.A += 0x66
                //         } else if (7 <= highNibble && highNibble <= 0xF &&
                //             0 <= lowNibble <= 9
                //         ) {
                //             this.A += 0xA0
                //         }
                //     }
                // } else {
                //     if (this.flagH) {
                //         // !C, H
                //         if (0 <= highNibble && highNibble <= 9 &&
                //             0 <= lowNibble && lowNibble <= 3
                //         ) {
                //             this.A += 0x06
                //         } else if (0xA <= highNibble && highNibble <= 0xF &&
                //             0 <= lowNibble && lowNibble <= 3
                //         ) {
                //             this.A += 0x66
                //             this.flagC = 1
                //         } else if (0 <= highNibble && highNibble <= 8 &&
                //             6 <= lowNibble && lowNibble <= 0xF    
                //         ) {
                //             this.A += 0xFA
                //         }
                //     } else {
                //         // !C, !H
                //         if (0 <= highNibble && highNibble <= 8 &&
                //             0xA <= lowNibble && lowNibble <= 0xF
                //         ) {
                //             this.A += 0x06
                //         } else if (0xA <= highNibble && highNibble <= 0xF &&
                //             0 <= lowNibble && lowNibble <= 9
                //         ) {
                //             this.A += 0x60
                //             this.flagC = 1
                //         } else if (9 <= highNibble && highNibble <= 0xF &&
                //             0xA <= lowNibble && lowNibble <= 0xF
                //         ) {
                //             this.A += 0x66
                //             this.flagC = 1
                //         }
                //     }
                // }
                // this.flagZ = this.A === 0
                // // TODO: H flag???

                if (!this.flagN) {
                    // Adjust for addition
                    if (this.flagH || (this.A & 0x0F) > 0x09) {
                        this.A += 0x06; // Adjust lower nibble
                    }
                    if (this.flagC || this.A > 0x99) {
                        this.A += 0x60; // Adjust for higher byte
                    }
                } else {
                    // Adjust for subtrfn
                    if (!this.flagH && (this.A & 0x0F) > 0x09) {
                        this.A -= 0x06; // Adjust lower nibble
                    }
                    if (!this.C && this.A > 0x99) {
                        this.A -= 0x60; // Adjust for higher byte
                    }
                }
                this.flagZ = this.A === 0
                this.flagC = this.A > 0x99
                this.flagH = (this.A & 0x0F) > 9
            }
        },
        0x28: {
            name: 'JR Z,r8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => {
                if (this.flagZ) {
                    this.PC += byte
                    this.instructions[0x28].cycles = 12
                } else {
                    this.instructions[0x28].cycles = 8
                }
            }
        },
        0x29: {
            name: 'ADD HL,HL',
            args: 0,
            cycles: 8,
            fn: () => this.HL = this.add16(this.HL, this.HL)
        },
        0x2A: {
            name: 'LD A,(HL+)',
            args: 0,
            cycles: 8,
            fn: () => {
                this.HL += 1
                this.A = this.mem.load8(this.HL)
            }
        },
        0x2B: {
            name: 'DEC HL',
            args: 0,
            cycles: 8,
            fn: () => this.HL--
        },
        0x2C: {
            name: 'INC L',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.inc(this.L)
        },
        0x2D: {
            name: 'DEC L',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.dec(this.L)
        },
        0x2E: {
            name: 'LD L,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.L = byte 
        },
        0x2F : {
            name: 'CPL',
            args: 0,
            cycles: 4,
            fn: () => {
                this.A = ~this.A
                this.flagH = 1
                this.flagN = 1
            }
        },
        0x30: {
            name: 'JR NC,r8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => {
                if (!this.flagC) {
                    this.PC += byte
                    this.instructions[0x30].cycles = 12
                } else {
                    this.instructions[0x30].cycles = 8
                }
            }
        },
        0x31: {
            name: 'LD SP,d16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => this.SP = word
        },
        0x32: {
            name: 'LD (HL-),A',
            args: 0,
            cycles: 8,
            fn: () => {
                this.HL -= 1
                this.mem.store8(this.A, this.HL)
            }
        },
        0x33: {
            name: 'INC SP',
            args: 0,
            cycles: 8,
            fn: () => this.SP++
        },
        0x34: {
            name: 'INC (HL)',
            args: 0,
            cycles: 12,
            fn: () => {
                let value = this.mem.load8(this.HL)
                this.flagZ = value === 0xFF
                this.flagH = (value & 0x0F) === 0x0F
                this.flagN = 0
                this.mem.store8(int8(value + 1), this.HL)
            }
        },
        0x35: {
            name: 'DEC (HL)',
            args: 0,
            cycles: 12,
            fn: () => {
                const value = this.mem.load8(this.HL)
                this.flagZ = value === 0x01
                this.flagH = (value & 0x0F) === 0
                this.flagN = 1
                this.mem.store8(int8(value - 1), this.HL)
            }
        },
        0x36: {
            name: 'LD (HL),d8',
            args: 1,
            cycles: 12,
            fn: (byte: Byte) => this.mem.store8(byte, this.HL)
        },
        0x37: {
            name: 'SCF',
            args: 0,
            cycles: 4,
            fn: () => {
                this.flagC = 1
                this.flagH = 0
                this.flagN = 0
            }
        },
        0x38: {
            name: 'JR C,r8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => {
                if (this.flagC) {
                    this.PC += byte
                    this.instructions[0x38].cycles = 12
                } else {
                    this.instructions[0x38].cycles = 8
                }
            }
        },
        0x39: {
            name: 'ADD HL,SP',
            args: 0,
            cycles: 8,
            fn: () => {
                this.HL = this.add16(this.HL, this.SP)
            }
        },
        0x3A: {
            name: 'LD A,(HL-)',
            args: 0,
            cycles: 8,
            fn: () => {
                this.HL -= 1
                this.A = this.mem.load8(this.HL)
            }
        },
        0x3B: {
            name: 'DEC SP',
            args: 0,
            cycles: 8,
            fn: () => this.SP--
        },
        0x3C: {
            name: 'INC A',
            args: 0,
            cycles: 4,
            fn: () => {
                this.A = this.inc(this.A)
            }
        },
        0x3D: {
            name: 'DEC A',
            args: 0,
            cycles: 4,
            fn: () => {
                this.A = this.dec(this.A)
            }
        },
        0x3E: {
            name: 'LD A,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.A = byte 
        },
        0x3F: {
            name: 'CCF',
            args: 0,
            cycles: 4,
            fn: () => {
                this.flagC = !this.flagC
                this.flagH = 0
                this.flagN = 0
            }
        },
        0x40: {
            name: 'LD B,B',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.B
        },
        0x41: {
            name: 'LD B,C',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.C
        },
        0x42: {
            name: 'LD B,D',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.D
        },
        0x43: {
            name: 'LD B,E',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.E
        },
        0x44: {
            name: 'LD B,H',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.H
        },
        0x45: {
            name: 'LD B,L',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.L
        },
        0x46: {
            name: 'LD B,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.mem.load8(this.HL)
        },
        0x47: {
            name: 'LD B,A',
            args: 0,
            cycles: 4,
            fn: () => this.B = this.A
        },
        0x48: {
            name: 'LD C,B',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.B
        },
        0x49: {
            name: 'LD C,C',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.C
        },
        0x4A: {
            name: 'LD C,D',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.D
        },
        0x4B: {
            name: 'LD C,E',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.E
        },
        0x4C: {
            name: 'LD C,H',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.H
        },
        0x4D: {
            name: 'LD C,L',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.L
        },
        0x4E: {
            name: 'LD C,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.mem.load8(this.HL)
        },
        0x4F: {
            name: 'LD C,A',
            args: 0,
            cycles: 4,
            fn: () => this.C = this.A
        },
        0X50: {
            name: 'LD D,B',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.B
        },
        0X51: {
            name: 'LD D,C',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.C
        },
        0X52: {
            name: 'LD D,D',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.D
        },
        0X53: {
            name: 'LD D,E',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.E
        },
        0X54: {
            name: 'LD D,H',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.H
        },
        0X55: {
            name: 'LD D,L',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.L
        },
        0X56: {
            name: 'LD D,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.mem.load8(this.HL)
        },
        0X57: {
            name: 'LD D,A',
            args: 0,
            cycles: 4,
            fn: () => this.D = this.A
        },
        0X58: {
            name: 'LD E,B',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.B
        },
        0X59: {
            name: 'LD E,C',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.C
        },
        0X5A: {
            name: 'LD E,D',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.D
        },
        0X5B: {
            name: 'LD E,E',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.E
        },
        0X5C: {
            name: 'LD E,H',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.H
        },
        0X5D: {
            name: 'LD E,L',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.B
        },
        0X5E: {
            name: 'LD E,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.mem.load8(this.HL)
        },
        0X5F: {
            name: 'LD E,A',
            args: 0,
            cycles: 4,
            fn: () => this.E = this.A
        },
        0X60: {
            name: 'LD H,B',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.B
        },
        0X61: {
            name: 'LD H,C',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.C
        },
        0X62: {
            name: 'LD H,D',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.D
        },
        0X63: {
            name: 'LD H,E',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.E
        },
        0X64: {
            name: 'LD H,H',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.H
        },
        0X65: {
            name: 'LD H,L',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.L
        },
        0X66: {
            name: 'LD H,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.mem.load8(this.HL)
        },
        0X67: {
            name: 'LD H,A',
            args: 0,
            cycles: 4,
            fn: () => this.H = this.A
        },
        0X68: {
            name: 'LD L,B',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.B
        },
        0X69: {
            name: 'LD L,C',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.C
        },
        0X6A: {
            name: 'LD L,D',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.D
        },
        0X6B: {
            name: 'LD L,E',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.E
        },
        0X6C: {
            name: 'LD L,H',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.H
        },
        0X6D: {
            name: 'LD L,L',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.B
        },
        0X6E: {
            name: 'LD L,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.mem.load8(this.HL)
        },
        0X6F: {
            name: 'LD L,A',
            args: 0,
            cycles: 4,
            fn: () => this.L = this.A
        },
        0X70: {
            name: 'LD (HL),B',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.B, this.HL)
        },
        0X71: {
            name: 'LD (HL),C',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.C, this.HL)
        },
        0X72: {
            name: 'LD (HL),D',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.D, this.HL)
        },
        0X73: {
            name: 'LD (HL),E',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.E, this.HL)
        },
        0X74: {
            name: 'LD (HL),H',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.H, this.HL)
        },
        0X75: {
            name: 'LD (HL),L',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.L, this.HL)
        },
        0X76: {
            name: 'HALT',
            args: 0,
            cycles: 4,
            fn: () => this.haltFlag = true
        },
        0X77: {
            name: 'LD (HL),A',
            args: 0,
            cycles: 8,
            fn: () => this.mem.store8(this.A, this.HL)
        },
        0X78: {
            name: 'LD A,B',
            args: 0,
            cycles: 4,
            fn: () => this.A = this.B
        },
        0X79: {
            name: 'LD A,C',
            args: 0,
            cycles: 4,
            fn: () => this.A = this.C
        },
        0X7A: {
            name: 'LD A,D',
            args: 0,
            cycles: 4,
            fn: () => this.A = this.D
        },
        0X7B: {
            name: 'LD A,E',
            args: 0,
            cycles: 4,
            fn: () => this.A = this.E
        },
        0X7C: {
            name: 'LD A,H',
            args: 0,
            cycles: 4,
            fn: () => this.A = this.H
        },
        0X7D: {
            name: 'LD A,L',
            args: 0,
            cycles: 4,
            fn: () => this.A = this.B
        },
        0X7E: {
            name: 'LD A,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.mem.load8(this.HL)
        },
        0X7F: {
            name: 'LD A,A',
            args: 0,
            cycles: 4,
            fn: () => this.A = this.A
        },
        0X80: {
            name: 'ADD A,B',
            args: 0,
            cycles: 4,
            fn: () => this.add8(this.A, this.B)
        },
        0X81: {
            name: 'ADD A,C',
            args: 0,
            cycles: 4,
            fn: () => this.add8(this.A, this.C)
        },
        0X82: {
            name: 'ADD A,D',
            args: 0,
            cycles: 4,
            fn: () => this.add8(this.A, this.D)
        },
        0X83: {
            name: 'ADD A,E',
            args: 0,
            cycles: 4,
            fn: () => this.add8(this.A, this.E)
        },
        0X84: {
            name: 'ADD A,H',
            args: 0,
            cycles: 4,
            fn: () => this.add8(this.A, this.H)
        },
        0X85: {
            name: 'ADD A,L',
            args: 0,
            cycles: 4,
            fn: () => this.add8(this.A, this.L)
        },
        0X86: {
            name: 'ADD A,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.add8(this.A, this.mem.load8(this.HL))
        },
        0X87: {
            name: 'ADD A,A',
            args: 0,
            cycles: 4,
            fn: () => this.add8(this.A, this.A)
        },
        0X88: {
            name: 'ADC A,B',
            args: 0,
            cycles: 4,
            fn: () => this.adc(this.A, this.B)
        },
        0X89: {
            name: 'ADC A,C',
            args: 0,
            cycles: 4,
            fn: () => this.adc(this.A, this.C)
        },
        0X8A: {
            name: 'ADC A,D',
            args: 0,
            cycles: 4,
            fn: () => this.adc(this.A, this.D)
        },
        0X8B: {
            name: 'ADC A,E',
            args: 0,
            cycles: 4,
            fn: () => this.adc(this.A, this.E)
        },
        0X8C: {
            name: 'ADC A,H',
            args: 0,
            cycles: 4,
            fn: () => this.adc(this.A, this.H)
        },
        0X8D: {
            name: 'ADC A,L',
            args: 0,
            cycles: 4,
            fn: () => this.adc(this.A, this.L)
        },
        0X8E: {
            name: 'ADC A,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.adc(this.A, this.mem.load8(this.HL))
        },
        0X8F: {
            name: 'ADC A,A',
            args: 0,
            cycles: 4,
            fn: () => this.adc(this.A, this.A)
        },
        0x90: {
            name: 'SUB B',
            args: 0,
            cycles: 4,
            fn: () => this.sub(this.B)
        },
        0x91: {
            name: 'SUB C',
            args: 0,
            cycles: 4,
            fn: () => this.sub(this.C)
        },
        0x92: {
            name: 'SUB D',
            args: 0,
            cycles: 4,
            fn: () => this.sub(this.D)
        },
        0x93: {
            name: 'SUB E',
            args: 0,
            cycles: 4,
            fn: () => this.sub(this.E)
        },
        0x94: {
            name: 'SUB H',
            args: 0,
            cycles: 4,
            fn: () => this.sub(this.H)
        },
        0x95: {
            name: 'SUB L',
            args: 0,
            cycles: 4,
            fn: () => this.sub(this.L)
        },
        0x96: {
            name: 'SUB (HL)',
            args: 0,
            cycles: 8,
            fn: () => this.sub(this.mem.load8(this.HL))
        },
        0x97: {
            name: 'SUB A,A',
            args: 0,
            cycles: 4,
            fn: () => this.sub(this.A)
        },
        0x98: {
            name: 'SBC A,B',
            args: 0,
            cycles: 4,
            fn: () => this.sbc(this.B)
        },
        0x99: {
            name: 'SBC A,C',
            args: 0,
            cycles: 4,
            fn: () => this.sbc(this.C)
        },
        0x9A: {
            name: 'SBC A,D',
            args: 0,
            cycles: 4,
            fn: () => this.sbc(this.D)
        },
        0x9B: {
            name: 'SBC A,E',
            args: 0,
            cycles: 4,
            fn: () => this.sbc(this.E)
        },
        0x9C: {
            name: 'SBC A,H',
            args: 0,
            cycles: 4,
            fn: () => this.sbc(this.H)
        },
        0x9D: {
            name: 'SBC A,L',
            args: 0,
            cycles: 4,
            fn: () => this.sbc(this.L)
        },
        0x9E: {
            name: 'SBC A,(HL)',
            args: 0,
            cycles: 8,
            fn: () => this.sbc(this.mem.load8(this.HL))
        },
        0x9F: {
            name: 'SBC A,A',
            args: 0,
            cycles: 4,
            fn: () => this.sbc(this.A)
        },
        0xA0: {
            name: 'AND B',
            args: 0,
            cycles: 4,
            fn: () => this.and(this.B)
        },
        0xA1: {
            name: 'AND C',
            args: 0,
            cycles: 4,
            fn: () => this.and(this.C)
        },
        0xA2: {
            name: 'AND D',
            args: 0,
            cycles: 4,
            fn: () => this.and(this.D)
        },
        0xA3: {
            name: 'AND E',
            args: 0,
            cycles: 4,
            fn: () => this.and(this.E)
        },
        0xA4: {
            name: 'AND H',
            args: 0,
            cycles: 4,
            fn: () => this.and(this.H)
        },
        0xA5: {
            name: 'AND L',
            args: 0,
            cycles: 4,
            fn: () => this.and(this.L)
        },
        0xA6: {
            name: 'AND (HL)',
            args: 0,
            cycles: 8,
            fn: () => this.and(this.mem.load8(this.HL))
        },
        0xA7: {
            name: 'AND A',
            args: 0,
            cycles: 4,
            fn: () => this.and(this.A)
        },
        0xA8: {
            name: 'XOR B',
            args: 0,
            cycles: 4,
            fn: () => this.xor(this.B)
        },
        0xA9: {
            name: 'XOR C',
            args: 0,
            cycles: 4,
            fn: () => this.xor(this.C)
        },
        0xAA: {
            name: 'XOR D',
            args: 0,
            cycles: 4,
            fn: () => this.xor(this.D)
        },
        0xAB: {
            name: 'XOR E',
            args: 0,
            cycles: 4,
            fn: () => this.xor(this.E)
        },
        0xAC: {
            name: 'XOR H',
            args: 0,
            cycles: 4,
            fn: () => this.xor(this.H)
        },
        0xAD: {
            name: 'XOR L',
            args: 0,
            cycles: 4,
            fn: () => this.xor(this.L)
        },
        0xAE: {
            name: 'XOR (HL)',
            args: 0,
            cycles: 8,
            fn: () => this.xor(this.mem.load8(this.HL))
        },
        0xAF: {
            name: 'XOR A',
            args: 0,
            cycles: 4,
            fn: () => this.xor(this.A)
        },
        0xB0: {
            name: 'OR B',
            args: 0,
            cycles: 4,
            fn: () => this.or(this.B)
        },
        0xB1: {
            name: 'OR C',
            args: 0,
            cycles: 4,
            fn: () => this.or(this.C)
        },
        0xB2: {
            name: 'OR D',
            args: 0,
            cycles: 4,
            fn: () => this.or(this.D)
        },
        0xB3: {
            name: 'OR E',
            args: 0,
            cycles: 4,
            fn: () => this.or(this.E)
        },
        0xB4: {
            name: 'OR H',
            args: 0,
            cycles: 4,
            fn: () => this.or(this.H)
        },
        0xB5: {
            name: 'OR L',
            args: 0,
            cycles: 4,
            fn: () => this.or(this.L)
        },
        0xB6: {
            name: 'OR (HL)',
            args: 0,
            cycles: 8,
            fn: () => this.or(this.mem.load8(this.HL))
        },
        0xB7: {
            name: 'OR A',
            args: 0,
            cycles: 4,
            fn: () => this.or(this.A)
        },
        0xB8: {
            name: 'CP B',
            args: 0,
            cycles: 4,
            fn: () => this.cp(this.B)
        },
        0xB9: {
            name: 'CP C',
            args: 0,
            cycles: 4,
            fn: () => this.cp(this.C)
        },
        0xBA: {
            name: 'CP D',
            args: 0,
            cycles: 4,
            fn: () => this.cp(this.D)
        },
        0xBB: {
            name: 'CP E',
            args: 0,
            cycles: 4,
            fn: () => this.cp(this.E)
        },
        0xBC: {
            name: 'CP H',
            args: 0,
            cycles: 4,
            fn: () => this.cp(this.H)
        },
        0xBD: {
            name: 'CP L',
            args: 0,
            cycles: 4,
            fn: () => this.cp(this.L)
        },
        0xBE: {
            name: 'CP (HL)',
            args: 0,
            cycles: 8,
            fn: () => this.cp(this.mem.load8(this.HL))
        },
        0xBF: {
            name: 'CP A',
            args: 0,
            cycles: 4,
            fn: () => this.cp(this.A)
        },
        0xC0: {
            name: 'RET NZ',
            args: 0,
            cycles: 8,
            fn: () => {
                if (this.flagZ) {
                    this.instructions[0xC0].cycles = 8
                } else {
                    this.ret()
                    this.instructions[0xC0].cycles = 20
                }
            }
        },
        0xC1: {
            name: 'POP BC',
            args: 0,
            cycles: 12,
            fn: () => this.BC = this.pop()
        },
        0xC2: {
            name: 'JP NZ,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagZ) {
                    this.instructions[0xC2].cycles = 12
                } else {
                    this.PC = word
                    this.instructions[0xC2].cycles = 16
                }
            }
        },
        0xC3: {
            name: 'JP a16',
            args: 2,
            cycles: 16,
            fn: (word: Word) => this.PC = word
        },
        0xC4: {
            name: 'CALL NZ,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagZ) {
                    this.instructions[0xC0].cycles = 12
                } else {
                    this.call(word)
                    this.instructions[0xC0].cycles = 24
                }
            }
        },
        0xC5: {
            name: 'PUSH BC',
            args: 0,
            cycles: 16,
            fn: () => this.push(this.BC)
        },
        0xC6: {
            name: 'ADD A,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.add8(this.A, byte)
        },
        0xC7: {
            name: 'RST 00h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0
            }
        },
        0xC8: {
            name: 'RET Z',
            args: 0,
            cycles: 8,
            fn: () => {
                if (this.flagZ) {
                    this.ret()
                    this.instructions[0xC0].cycles = 20
                } else {
                    this.instructions[0xC0].cycles = 8
                }
            }
        },
        0xC9: {
            name: 'RET',
            args: 0,
            cycles: 16,
            fn: () => this.ret()
        },
        0xCA: {
            name: 'JP Z,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagZ) {
                    this.PC = word
                    this.instructions[0xC2].cycles = 16
                } else {
                    this.instructions[0xC2].cycles = 12
                }
            }
        },
        0xCB: {
            name: 'PREFIX',
            args: 0,
            cycles: 4,
            fn: () => {
                const instruction = 0xCB00 | this.mem.load8(this.PC)
                this.PC++
                this.instructions[instruction].fn()
                // TODO: await for the called instruction clock cycle
            }
        },
        0xCC: {
            name: 'CALL Z,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagZ) {
                    this.call(word)
                    this.instructions[0xC0].cycles = 24
                } else {
                    this.instructions[0xC0].cycles = 12
                }
            }
        },
        0xCD: {
            name: 'CALL a16',
            args: 2,
            cycles: 24,
            fn: (word: Word) => {
                this.call(word)
            }
        },
        0xCE: {
            name: 'ADC A,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.adc(this.A, byte)
        },
        0xCF: {
            name: 'RST 08h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0x08
            }
        },
        0xD0: {
            name: 'RET NC',
            args: 0,
            cycles: 8,
            fn: () => {
                if (this.flagC) {
                    this.instructions[0xC0].cycles = 8
                } else {
                    this.ret()
                    this.instructions[0xC0].cycles = 20
                }
            }
        },
        0xD1: {
            name: 'POP DE',
            args: 0,
            cycles: 12,
            fn: () => this.DE = this.pop()
        },
        0xD2: {
            name: 'JP NC,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagC) {
                    this.instructions[0xC2].cycles = 12
                } else {
                    this.PC = word
                    this.instructions[0xC2].cycles = 16
                }
            }
        },
        0xD3: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xD3')
            }
        },
        0xD4: {
            name: 'CALL NC,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagC) {
                    this.instructions[0xC0].cycles = 12
                } else {
                    this.call(word)
                    this.instructions[0xC0].cycles = 24
                }
            }
        },
        0xD5: {
            name: 'PUSH DE',
            args: 0,
            cycles: 16,
            fn: () => this.push(this.DE)
        },
        0xD6: {
            name: 'SUB d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => {
                this.flagZ = this.A === byte
                this.flagN = 1
                this.flagH = (this.A & 0x0F) < (byte & 0x0F)
                this.flagC = this.A < byte
                this.A -= byte
            }
        },
        0xD7: {
            name: 'RST 10h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0x10
            }
        },
        0xD8: {
            name: 'RET C',
            args: 0,
            cycles: 8,
            fn: () => {
                if (this.flagC) {
                    this.ret()
                    this.instructions[0xC0].cycles = 20
                } else {
                    this.instructions[0xC0].cycles = 8
                }
            }
        },
        0xD9: {
            name: 'RETI',
            args: 0,
            cycles: 16,
            fn: () => {
                // TODO: check this funcion
                this.ret()
            }
        },
        0xDA: {
            name: 'JP C,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagC) {
                    this.PC = word
                    this.instructions[0xC2].cycles = 16
                } else {
                    this.instructions[0xC2].cycles = 12
                }
            }
        },
        0xDB: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xDB')
            }
        },
        0xDC: {
            name: 'CALL C,a16',
            args: 2,
            cycles: 12,
            fn: (word: Word) => {
                if (this.flagC) {
                    this.call(word)
                    this.instructions[0xC0].cycles = 24
                } else {
                    this.instructions[0xC0].cycles = 12
                }
            }
        },
        0xDD: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xDD')
            }
        },
        0xDE: {
            name: 'SDC A,d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => {
                this.flagZ = this.A === byte + 1
                this.flagN = 1
                this.flagH = (this.A & 0x0F) < ((byte + 1) & 0x0F)
                this.flagC = this.A < byte + 1
                this.A -= byte - 1
            }
        },
        0xDF: {
            name: 'RST 18h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0x18
            }
        },
        0xE0: {
            name: 'LDH (a8),A',
            args: 1,
            cycles: 12,
            fn: (byte: Byte) => this.A = this.mem.load8(int16(0xFF00 + byte))
        },
        0xE1: {
            name: 'POP HL',
            args: 0,
            cycles: 12,
            fn: () => this.HL = this.pop()
        },
        0xE2: {
            name: 'LD (C),A',
            args: 0,
            cycles: 8,
            fn: () => {
                this.mem.store8(this.A, int16(0xFF00 + this.C))
            }
        },
        0xE3: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xE3')
            }
        },
        0xE4: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xE4')
            }
        },
        0xE5: {
            name: 'PUSH HL',
            args: 0,
            cycles: 16,
            fn: () => this.push(this.HL)
        },
        0xE6: {
            name: 'AND d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.and(byte)
        },
        0xE7: {
            name: 'RST 20h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0x20
            }
        },
        0xE8: {
            name: 'ADD SP,r8',
            args: 1,
            cycles: 16,
            fn: (byte: Byte) => {
                this.add16(this.SP, int16(byte))
                this.flagZ = 0
            }
        },
        0xE9: {
            name: 'JP HL',
            args: 1,
            cycles: 4,
            fn: () => this.PC = this.HL
        },
        0xEA: {
            name: 'LD (a16),A',
            args: 2,
            cycles: 16,
            fn: (word: Word) => this.mem.store8(this.A, word)
        },
        0xEB: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xEB')
            }
        },
        0xEC: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xEC')
            }
        },
        0xED: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xED')
            }
        },
        0xEE: {
            name: 'XOR d8',
            args: 0,
            cycles: 1,
            fn: (byte: Byte) => this.xor(byte)
        },
        0xEF: {
            name: 'RST 28h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0x28
            }
        },
        0xF0: {
            name: 'LDH A,(a8)',
            args: 1,
            cycles: 12,
            fn: (byte: Byte) => this.mem.store8(this.A, int16(0xFF00 + byte))
        },
        0xF1: {
            name: 'POP AF',
            args: 0,
            cycles: 12,
            fn: () => this.AF = this.pop()
        },
        0xF2: {
            name: 'LD A,(C)',
            args: 0,
            cycles: 8,
            fn: () => {
                this.A = this.mem.load8(int16(0xFF00 + this.C))
            }
        },
        0xF3: {
            name: 'DI',
            args: 0,
            cycles: 1,
            fn: () => this.interruptEnabled = false
        },
        0xF4: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xF4')
            }
        },
        0xF5: {
            name: 'PUSH AF',
            args: 0,
            cycles: 16,
            fn: () => this.push(this.AF)
        },
        0xF6: {
            name: 'OR d8',
            args: 1,
            cycles: 8,
            fn: (byte: Byte) => this.or(byte)
        },
        0xF7: {
            name: 'RST 30h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0x30
            }
        },
        0xF8: {
            name: 'LD HL,SP + r8',
            args: 1,
            cycles: 12,
            fn: (byte: Byte) => {
                const sum = this.SP + byte

                this.flagZ = 0
                this.flagN = 0
                this.flagC = sum > 0x03FF
                this.flagH = sum > 0xFFFF
                this.HL = sum
            }
        },
        0xF9: {
            name: 'LD SP,HL',
            args: 0,
            cycles: 8,
            fn: () => this.SP = this.HL
        },
        0xFA: {
            name: 'LD A,(a16)',
            args: 0,
            cycles: 16,
            fn: (word: Word) => this.A = this.mem.load8(word)
        },
        0xFB: {
            name: 'EI',
            args: 0,
            cycles: 8,
            fn: () => this.interruptEnabled = true
        },
        0xFC: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xFC')
            }
        },
        0xFD: {
            name: '-',
            args: 0,
            cycles: 1,
            fn: () => {
                throw new Error('Invalid instruction 0xFD')
            }
        },
        0xFE: {
            name: 'CP d8',
            args: 0,
            cycles: 8,
            fn: (byte: Byte) => this.cp(byte)
        },        
        0xFF: {
            name: 'RST 38h',
            args: 0,
            cycles: 16,
            fn: () => {
                this.mem.store16(this.PC, this.SP)
                this.PC = 0x38
            }
        },
        0xCB00: {
            name: 'RLC B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.rlc(this.B)
        },
        0xCB01: {
            name: 'RLC C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.rlc(this.C)
        },
        0xCB02: {
            name: 'RLC D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.rlc(this.D)
        },
        0xCB03: {
            name: 'RLC E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.rlc(this.E)
        },
        0xCB04: {
            name: 'RLC H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.rlc(this.H)
        },
        0xCB05: {
            name: 'RLC L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.rlc(this.L)
        },
        0xCB06: {
            name: 'RLC (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.rlc(this.mem.load8(this.HL)), this.HL)
        },
        0xCB07: {
            name: 'RLC A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.rlc(this.A)
        },
        0xCB08: {
            name: 'RRC B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.rrc(this.B)
        },
        0xCB09: {
            name: 'RRC C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.rrc(this.C)
        },
        0xCB0A: {
            name: 'RRC D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.rrc(this.D)
        },
        0xCB0B: {
            name: 'RRC E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.rrc(this.E)
        },
        0xCB0C: {
            name: 'RRC H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.rrc(this.H)
        },
        0xCB0D: {
            name: 'RRC L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.rrc(this.L)
        },
        0xCB0E: {
            name: 'RRC (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.rrc(this.mem.load8(this.HL)), this.HL)
        },
        0xCB0F: {
            name: 'RRC A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.rrc(this.A)
        },
        0xCB10: {
            name: 'RL B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.rl(this.B)
        },
        0xCB11: {
            name: 'RL C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.rl(this.C)
        },
        0xCB12: {
            name: 'RL D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.rl(this.D)
        },
        0xCB13: {
            name: 'RL E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.rl(this.E)
        },
        0xCB14: {
            name: 'RL H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.rl(this.H)
        },
        0xCB15: {
            name: 'RL L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.rl(this.L)
        },
        0xCB16: {
            name: 'RL (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.rl(this.mem.load8(this.HL)), this.HL)
        },
        0xCB17: {
            name: 'RL A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.rl(this.A)
        },
        0xCB18: {
            name: 'RR B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.rr(this.B)
        },
        0xCB19: {
            name: 'RR C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.rr(this.C)
        },
        0xCB1A: {
            name: 'RR D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.rr(this.D)
        },
        0xCB1B: {
            name: 'RR E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.rr(this.E)
        },
        0xCB1C: {
            name: 'RR H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.rr(this.H)
        },
        0xCB1D: {
            name: 'RR L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.rr(this.L)
        },
        0xCB1E: {
            name: 'RR (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.rr(this.mem.load8(this.HL)), this.HL)
        },
        0xCB1F: {
            name: 'RR A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.rr(this.A)
        },
        0xCB20: {
            name: 'SLA B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.sla(this.B)
        },
        0xCB21: {
            name: 'SLA C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.sla(this.C)
        },
        0xCB22: {
            name: 'SLA D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.sla(this.D)
        },
        0xCB23: {
            name: 'SLA E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.sla(this.E)
        },
        0xCB24: {
            name: 'SLA H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.sla(this.H)
        },
        0xCB25: {
            name: 'SLA L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.sla(this.L)
        },
        0xCB26: {
            name: 'SLA (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.sla(this.mem.load8(this.HL)), this.HL)
        },
        0xCB27: {
            name: 'SLA A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.sla(this.A)
        },
        0xCB28: {
            name: 'SRA B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.sra(this.B)
        },
        0xCB29: {
            name: 'SRA C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.sra(this.C)
        },
        0xCB2A: {
            name: 'SRA D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.sra(this.D)
        },
        0xCB2B: {
            name: 'SRA E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.sra(this.E)
        },
        0xCB2C: {
            name: 'SRA H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.sra(this.H)
        },
        0xCB2D: {
            name: 'SRA L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.sra(this.L)
        },
        0xCB2E: {
            name: 'SRA (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.sra(this.mem.load8(this.HL)), this.HL)
        },
        0xCB2F: {
            name: 'SRA A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.sra(this.A)
        },
        0xCB30: {
            name: 'SWAP B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.swap(this.B)
        },
        0xCB31: {
            name: 'SWAP C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.swap(this.C)
        },
        0xCB32: {
            name: 'SWAP D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.swap(this.D)
        },
        0xCB33: {
            name: 'SWAP E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.swap(this.E)
        },
        0xCB34: {
            name: 'SWAP H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.swap(this.H)
        },
        0xCB35: {
            name: 'SWAP L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.swap(this.L)
        },
        0xCB36: {
            name: 'SWAP (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.swap(this.mem.load8(this.HL)), this.HL)
        },
        0xCB37: {
            name: 'SWAP A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.swap(this.A)
        },
        0xCB38: {
            name: 'SRL B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.sra(this.B)
        },
        0xCB39: {
            name: 'SRL C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.sra(this.C)
        },
        0xCB3A: {
            name: 'SRL D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.sra(this.D)
        },
        0xCB3B: {
            name: 'SRL E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.sra(this.E)
        },
        0xCB3C: {
            name: 'SRL H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.sra(this.H)
        },
        0xCB3D: {
            name: 'SRL L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.sra(this.L)
        },
        0xCB3E: {
            name: 'SRL (HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.sra(this.mem.load8(this.HL)), this.HL)
        },
        0xCB3F: {
            name: 'SRL A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.sra(this.A)
        },
        0xCB40: {
            name: 'BIT 0,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(0, this.B)
        },
        0xCB41: {
            name: 'BIT 0,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(0, this.C)
        },
        0xCB42: {
            name: 'BIT 0,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(0, this.D)
        },
        0xCB43: {
            name: 'BIT 0,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(0, this.E)
        },
        0xCB44: {
            name: 'BIT 0,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(0, this.H)
        },
        0xCB45: {
            name: 'BIT 0,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(0, this.L)
        },
        0xCB46: {
            name: 'BIT 0,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(0, this.mem.load8(this.HL))
        },
        0xCB47: {
            name: 'BIT 0,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(0, this.A)
        },
        0xCB48: {
            name: 'BIT 1,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(1, this.B)
        },
        0xCB49: {
            name: 'BIT 1,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(1, this.C)
        },
        0xCB4A: {
            name: 'BIT 1,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(1, this.D)
        },
        0xCB4B: {
            name: 'BIT 1,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(1, this.E)
        },
        0xCB4C: {
            name: 'BIT 1,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(1, this.H)
        },
        0xCB4D: {
            name: 'BIT 1,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(1, this.L)
        },
        0xCB4E: {
            name: 'BIT 1,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(1, this.mem.load8(this.HL))
        },
        0xCB4F: {
            name: 'BIT 1,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(1, this.A)
        },
        0xCB50: {
            name: 'BIT 2,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(2, this.B)
        },
        0xCB51: {
            name: 'BIT 2,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(2, this.C)
        },
        0xCB52: {
            name: 'BIT 2,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(2, this.D)
        },
        0xCB53: {
            name: 'BIT 2,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(2, this.E)
        },
        0xCB54: {
            name: 'BIT 2,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(2, this.H)
        },
        0xCB55: {
            name: 'BIT 2,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(2, this.L)
        },
        0xCB56: {
            name: 'BIT 2,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(2, this.mem.load8(this.HL))
        },
        0xCB57: {
            name: 'BIT 2,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(2, this.A)
        },
        0xCB58: {
            name: 'BIT 3,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(3, this.B)
        },
        0xCB59: {
            name: 'BIT 3,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(3, this.C)
        },
        0xCB5A: {
            name: 'BIT 3,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(3, this.D)
        },
        0xCB5B: {
            name: 'BIT 3,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(3, this.E)
        },
        0xCB5C: {
            name: 'BIT 3,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(3, this.H)
        },
        0xCB5D: {
            name: 'BIT 3,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(3, this.L)
        },
        0xCB5E: {
            name: 'BIT 3,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(3, this.mem.load8(this.HL))
        },
        0xCB5F: {
            name: 'BIT 3,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(3, this.A)
        },
        0xCB60: {
            name: 'BIT 4,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(4, this.B)
        },
        0xCB61: {
            name: 'BIT 4,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(4, this.C)
        },
        0xCB62: {
            name: 'BIT 4,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(4, this.D)
        },
        0xCB63: {
            name: 'BIT 4,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(4, this.E)
        },
        0xCB64: {
            name: 'BIT 4,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(4, this.H)
        },
        0xCB65: {
            name: 'BIT 4,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(4, this.L)
        },
        0xCB66: {
            name: 'BIT 4,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(4, this.mem.load8(this.HL))
        },
        0xCB67: {
            name: 'BIT 4,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(4, this.A)
        },
        0xCB68: {
            name: 'BIT 5,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(5, this.B)
        },
        0xCB69: {
            name: 'BIT 5,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(5, this.C)
        },
        0xCB6A: {
            name: 'BIT 5,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(5, this.D)
        },
        0xCB6B: {
            name: 'BIT 5,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(5, this.E)
        },
        0xCB6C: {
            name: 'BIT 5,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(5, this.H)
        },
        0xCB6D: {
            name: 'BIT 5,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(5, this.L)
        },
        0xCB6E: {
            name: 'BIT 5,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(5, this.mem.load8(this.HL))
        },
        0xCB6F: {
            name: 'BIT 5,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(5, this.A)
        },
        0xCB70: {
            name: 'BIT 6,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(6, this.B)
        },
        0xCB71: {
            name: 'BIT 6,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(6, this.C)
        },
        0xCB72: {
            name: 'BIT 6,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(6, this.D)
        },
        0xCB73: {
            name: 'BIT 6,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(6, this.E)
        },
        0xCB74: {
            name: 'BIT 6,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(6, this.H)
        },
        0xCB75: {
            name: 'BIT 6,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(6, this.L)
        },
        0xCB76: {
            name: 'BIT 6,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(6, this.mem.load8(this.HL))
        },
        0xCB77: {
            name: 'BIT 6,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(6, this.A)
        },
        0xCB78: {
            name: 'BIT 7,B',
            args: 0,
            cycles: 8,
            fn: () => this.bit(7, this.B)
        },
        0xCB79: {
            name: 'BIT 7,C',
            args: 0,
            cycles: 8,
            fn: () => this.bit(7, this.C)
        },
        0xCB7A: {
            name: 'BIT 7,D',
            args: 0,
            cycles: 8,
            fn: () => this.bit(7, this.D)
        },
        0xCB7B: {
            name: 'BIT 7,E',
            args: 0,
            cycles: 8,
            fn: () => this.bit(7, this.E)
        },
        0xCB7C: {
            name: 'BIT 7,H',
            args: 0,
            cycles: 8,
            fn: () => this.bit(7, this.H)
        },
        0xCB7D: {
            name: 'BIT 7,L',
            args: 0,
            cycles: 8,
            fn: () => this.bit(7, this.L)
        },
        0xCB7E: {
            name: 'BIT 7,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.bit(7, this.mem.load8(this.HL))
        },
        0xCB7F: {
            name: 'BIT 7,A',
            args: 0,
            cycles: 8,
            fn: () => this.bit(7, this.A)
        },
        0xCB80: {
            name: 'RES 0,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(0, this.B)
        },
        0xCB81: {
            name: 'RES 0,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(0, this.C)
        },
        0xCB82: {
            name: 'RES 0,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(0, this.D)
        },
        0xCB83: {
            name: 'RES 0,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(0, this.E)
        },
        0xCB84: {
            name: 'RES 0,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(0, this.H)
        },
        0xCB85: {
            name: 'RES 0,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(0, this.L)
        },
        0xCB86: {
            name: 'RES 0,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(0, this.mem.load8(this.HL)), this.HL)
        },
        0xCB87: {
            name: 'RES 0,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(0, this.A)
        },
        0xCB88: {
            name: 'RES 1,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(1, this.B)
        },
        0xCB89: {
            name: 'RES 1,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(1, this.C)
        },
        0xCB8A: {
            name: 'RES 1,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(1, this.D)
        },
        0xCB8B: {
            name: 'RES 1,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(1, this.E)
        },
        0xCB8C: {
            name: 'RES 1,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(1, this.H)
        },
        0xCB8D: {
            name: 'RES 1,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(1, this.L)
        },
        0xCB8E: {
            name: 'RES 1,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(1, this.mem.load8(this.HL)), this.HL)
        },
        0xCB8F: {
            name: 'RES 1,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(1, this.A)
        },
        0xCB90: {
            name: 'RES 2,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(2, this.B)
        },
        0xCB91: {
            name: 'RES 2,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(2, this.C)
        },
        0xCB92: {
            name: 'RES 2,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(2, this.D)
        },
        0xCB93: {
            name: 'RES 2,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(2, this.E)
        },
        0xCB94: {
            name: 'RES 2,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(2, this.H)
        },
        0xCB95: {
            name: 'RES 2,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(2, this.L)
        },
        0xCB96: {
            name: 'RES 2,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(2, this.mem.load8(this.HL)), this.HL)
        },
        0xCB97: {
            name: 'RES 2,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(2, this.A)
        },
        0xCB98: {
            name: 'RES 3,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(3, this.B)
        },
        0xCB99: {
            name: 'RES 3,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(3, this.C)
        },
        0xCB9A: {
            name: 'RES 3,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(3, this.D)
        },
        0xCB9B: {
            name: 'RES 3,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(3, this.E)
        },
        0xCB9C: {
            name: 'RES 3,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(3, this.H)
        },
        0xCB9D: {
            name: 'RES 3,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(3, this.L)
        },
        0xCB9E: {
            name: 'RES 3,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(3, this.mem.load8(this.HL)), this.HL)
        },
        0xCB9F: {
            name: 'RES 3,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(3, this.A)
        },
        0xCBA0: {
            name: 'RES 4,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(4, this.B)
        },
        0xCBA1: {
            name: 'RES 4,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(4, this.C)
        },
        0xCBA2: {
            name: 'RES 4,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(4, this.D)
        },
        0xCBA3: {
            name: 'RES 4,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(4, this.E)
        },
        0xCBA4: {
            name: 'RES 4,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(4, this.H)
        },
        0xCBA5: {
            name: 'RES 4,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(4, this.L)
        },
        0xCBA6: {
            name: 'RES 4,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(4, this.mem.load8(this.HL)), this.HL)
        },
        0xCBA7: {
            name: 'RES 4,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(4, this.A)
        },
        0xCBA8: {
            name: 'RES 5,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(5, this.B)
        },
        0xCBA9: {
            name: 'RES 5,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(5, this.C)
        },
        0xCBAA: {
            name: 'RES 5,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(5, this.D)
        },
        0xCBAB: {
            name: 'RES 5,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(5, this.E)
        },
        0xCBAC: {
            name: 'RES 5,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(5, this.H)
        },
        0xCBAD: {
            name: 'RES 5,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(5, this.L)
        },
        0xCBAE: {
            name: 'RES 5,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(5, this.mem.load8(this.HL)), this.HL)
        },
        0xCBAF: {
            name: 'RES 5,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(5, this.A)
        },
        0xCBB0: {
            name: 'RES 6,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(6, this.B)
        },
        0xCBB1: {
            name: 'RES 6,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(6, this.C)
        },
        0xCBB2: {
            name: 'RES 6,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(6, this.D)
        },
        0xCBB3: {
            name: 'RES 6,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(6, this.E)
        },
        0xCBB4: {
            name: 'RES 6,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(6, this.H)
        },
        0xCBB5: {
            name: 'RES 6,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(6, this.L)
        },
        0xCBB6: {
            name: 'RES 6,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(6, this.mem.load8(this.HL)), this.HL)
        },
        0xCBB7: {
            name: 'RES 6,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(6, this.A)
        },
        0xCBB8: {
            name: 'RES 7,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.res(7, this.B)
        },
        0xCBB9: {
            name: 'RES 7,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.res(7, this.C)
        },
        0xCBBA: {
            name: 'RES 7,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.res(7, this.D)
        },
        0xCBBB: {
            name: 'RES 7,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.res(7, this.E)
        },
        0xCBBC: {
            name: 'RES 7,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.res(7, this.H)
        },
        0xCBBD: {
            name: 'RES 7,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.res(7, this.L)
        },
        0xCBBE: {
            name: 'RES 7,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.res(7, this.mem.load8(this.HL)), this.HL)
        },
        0xCBBF: {
            name: 'RES 7,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.res(7, this.A)
        },
        0xCBC0: {
            name: 'SET 0,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(0, this.B)
        },
        0xCBC1: {
            name: 'SET 0,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(0, this.C)
        },
        0xCBC2: {
            name: 'SET 0,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(0, this.D)
        },
        0xCBC3: {
            name: 'SET 0,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(0, this.E)
        },
        0xCBC4: {
            name: 'SET 0,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(0, this.H)
        },
        0xCBC5: {
            name: 'SET 0,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(0, this.L)
        },
        0xCBC6: {
            name: 'SET 0,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(0, this.mem.load8(this.HL)), this.HL)
        },
        0xCBC7: {
            name: 'SET 0,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(0, this.A)
        },
        0xCBC8: {
            name: 'SET 1,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(1, this.B)
        },
        0xCBC9: {
            name: 'SET 1,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(1, this.C)
        },
        0xCBCA: {
            name: 'SET 1,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(1, this.D)
        },
        0xCBCB: {
            name: 'SET 1,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(1, this.E)
        },
        0xCBCC: {
            name: 'SET 1,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(1, this.H)
        },
        0xCBCD: {
            name: 'SET 1,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(1, this.L)
        },
        0xCBCE: {
            name: 'SET 1,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(1, this.mem.load8(this.HL)), this.HL)
        },
        0xCBCF: {
            name: 'SET 1,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(1, this.A)
        },
        0xCBD0: {
            name: 'SET 2,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(2, this.B)
        },
        0xCBD1: {
            name: 'SET 2,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(2, this.C)
        },
        0xCBD2: {
            name: 'SET 2,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(2, this.D)
        },
        0xCBD3: {
            name: 'SET 2,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(2, this.E)
        },
        0xCBD4: {
            name: 'SET 2,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(2, this.H)
        },
        0xCBD5: {
            name: 'SET 2,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(2, this.L)
        },
        0xCBD6: {
            name: 'SET 2,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(2, this.mem.load8(this.HL)), this.HL)
        },
        0xCBD7: {
            name: 'SET 2,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(2, this.A)
        },
        0xCBD8: {
            name: 'SET 3,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(3, this.B)
        },
        0xCBD9: {
            name: 'SET 3,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(3, this.C)
        },
        0xCBDA: {
            name: 'SET 3,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(3, this.D)
        },
        0xCBDB: {
            name: 'SET 3,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(3, this.E)
        },
        0xCBDC: {
            name: 'SET 3,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(3, this.H)
        },
        0xCBDD: {
            name: 'SET 3,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(3, this.L)
        },
        0xCBDE: {
            name: 'SET 3,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(3, this.mem.load8(this.HL)), this.HL)
        },
        0xCBDF: {
            name: 'SET 3,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(3, this.A)
        },
        0xCBE0: {
            name: 'SET 4,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(4, this.B)
        },
        0xCBE1: {
            name: 'SET 4,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(4, this.C)
        },
        0xCBE2: {
            name: 'SET 4,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(4, this.D)
        },
        0xCBE3: {
            name: 'SET 4,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(4, this.E)
        },
        0xCBE4: {
            name: 'SET 4,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(4, this.H)
        },
        0xCBE5: {
            name: 'SET 4,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(4, this.L)
        },
        0xCBE6: {
            name: 'SET 4,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(4, this.mem.load8(this.HL)), this.HL)
        },
        0xCBE7: {
            name: 'SET 4,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(4, this.A)
        },
        0xCBE8: {
            name: 'SET 5,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(5, this.B)
        },
        0xCBE9: {
            name: 'SET 5,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(5, this.C)
        },
        0xCBEA: {
            name: 'SET 5,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(5, this.D)
        },
        0xCBEB: {
            name: 'SET 5,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(5, this.E)
        },
        0xCBEC: {
            name: 'SET 5,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(5, this.H)
        },
        0xCBED: {
            name: 'SET 5,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(5, this.L)
        },
        0xCBEE: {
            name: 'SET 5,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(5, this.mem.load8(this.HL)), this.HL)
        },
        0xCBEF: {
            name: 'SET 5,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(5, this.A)
        },
        0xCBF0: {
            name: 'SET 6,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(6, this.B)
        },
        0xCBF1: {
            name: 'SET 6,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(6, this.C)
        },
        0xCBF2: {
            name: 'SET 6,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(6, this.D)
        },
        0xCBF3: {
            name: 'SET 6,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(6, this.E)
        },
        0xCBF4: {
            name: 'SET 6,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(6, this.H)
        },
        0xCBF5: {
            name: 'SET 6,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(6, this.L)
        },
        0xCBF6: {
            name: 'SET 6,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(6, this.mem.load8(this.HL)), this.HL)
        },
        0xCBF7: {
            name: 'SET 6,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(6, this.A)
        },
        0xCBF8: {
            name: 'SET 7,B',
            args: 0,
            cycles: 8,
            fn: () => this.B = this.set(7, this.B)
        },
        0xCBF9: {
            name: 'SET 7,C',
            args: 0,
            cycles: 8,
            fn: () => this.C = this.set(7, this.C)
        },
        0xCBFA: {
            name: 'SET 7,D',
            args: 0,
            cycles: 8,
            fn: () => this.D = this.set(7, this.D)
        },
        0xCBFB: {
            name: 'SET 7,E',
            args: 0,
            cycles: 8,
            fn: () => this.E = this.set(7, this.E)
        },
        0xCBFC: {
            name: 'SET 7,H',
            args: 0,
            cycles: 8,
            fn: () => this.H = this.set(7, this.H)
        },
        0xCBFD: {
            name: 'SET 7,L',
            args: 0,
            cycles: 8,
            fn: () => this.L = this.set(7, this.L)
        },
        0xCBFE: {
            name: 'SET 7,(HL)',
            args: 0,
            cycles: 16,
            fn: () => this.mem.store8(this.set(7, this.mem.load8(this.HL)), this.HL)
        },
        0xCBFF: {
            name: 'SET 7,A',
            args: 0,
            cycles: 8,
            fn: () => this.A = this.set(7, this.A)
        },
    }

    constructor (program: Int8Array) {
        super()
        const _program = program.slice(this.mem.rom.start, this.mem.rom.end)
        _program.forEach((byte, i) => {
            this.mem.store8(int8(byte), int16(i))
        })
    }

    start () {
        while (!this.stopFlag) {
            const instruction = this.instructions[uint8(this.mem.load8(this.PC))]
            this.PC++

            // 8 bit
            if (instruction.args === 1) {
                const byte = this.mem.load8(this.PC)

                this.PC++
                instruction.fn(byte)
            }
            // 16 bit
            else if (instruction.args === 2) {
                const word = this.mem.load8(this.PC) | (this.mem.load8(int16(this.PC + 1)) << 8)

                this.PC += 2
                console.log(word)
                instruction.fn(word)
            }
            else {
                instruction.fn()
            }
            // if (interrupt) -> 
        }
    }
}