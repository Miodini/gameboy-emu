import type { Bit, Byte, Word } from '../../src/types.js'
import Cpu from '../../src/cpu'
import { int8, int16, uint16 } from '../../src/utils.js'
import { jest, describe, expect, test, beforeEach } from '@jest/globals'
jest.mock('../../src/cpu')

const cpu = new Cpu(new Int8Array(0))

function getRegisterValue(register: string): Byte | Word | null {
    return (cpu as any)[register] ?? null
}
function setRegisterValue(register: string, value: Byte | Word) {
    if (typeof (cpu as any)[register] !== 'undefined') {
        (cpu as any)[register] = value   
    }
}

function getFlag(flag: string): number | null {
    return (cpu as any)[`flag${flag}`] ?? null
}
function setFlag(flag: string, value: Bit | boolean) {
    if (typeof (cpu as any)[`flag${flag}`] !== 'undefined') {
        (cpu as any)[`flag${flag}`] = value
    }
}

function getRegistersFromOpCode(opCode: number, registerRegex: RegExp) {
    const instruction = cpu.instructions[opCode]
    const match = instruction.name.match(registerRegex)

    if (!match) {
        throw new TypeError(`No registers for regex ${registerRegex} found in instruction ${opCode}.`)
    }
    return { instruction, registers: match.slice(1) || [] }
}
function getFlagsFromOpCode(opCode: number, flagRegex: RegExp) {
    const instruction = cpu.instructions[opCode]
    const match = instruction.name.match(flagRegex)

    if (!match) {
        throw new TypeError(`No flags for regex ${flagRegex} found in instruction ${opCode}.`)
    }
    return { instruction, flags: match.slice(1) || [] }
}

beforeEach(() => {
    // Reset registers before operating
    cpu.AF = 0
    cpu.BC = 0
    cpu.DE = 0
    cpu.HL = 0
})

describe('Instructions', () => {
    // Conmmon constants to be tested for many instructions
    const value = int8(100), aux = int8(20), address = uint16(0x100), auxAddress = uint16(0x200)

    test.each([
        0x03, 0x04, 0x0C, 0x13, 0x14, 0x1C, 0x23, 0x24, 0x2C, 0x33, 0x3C
    ])('INC [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /INC (\w+)$/i)

        setRegisterValue(register, value)
        instruction.fn()
        expect(getRegisterValue(register)).toBe(value + 1)
    })
    test.each([
        0x05, 0x0B, 0x0D, 0x15, 0x1B, 0x1D, 0x25, 0x2B, 0x2D, 0x3B, 0x3D
    ])('DEC [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /DEC (\w+)$/)

        setRegisterValue(register, value)
        instruction.fn()
        expect(getRegisterValue(register)).toBe(value - 1)
    })
    test.each([
        0x01, 0x11, 0x21, 0x31
    ])('LD reg,d16 [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /LD (\w+),d16$/, )

        instruction.fn(address)
        expect(getRegisterValue(register)).toBe(address)
    })
    test.each([
        0x02, 0x12, 0x77, 
    ])('LD (reg),A [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /LD \((\w+)\),A$/)

        cpu.A = value
        setRegisterValue(register, address)
        instruction.fn()
        expect(cpu.mem.load8(address)).toBe(value)
    })
    test.each([
        0x06, 0x0E, 0x16, 0x1E, 0x26, 0x2E, 0x3E
    ])('LD reg,d8 [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /LD (\w+),d8$/)
        
        instruction.fn(value)
        expect(getRegisterValue(register)).toBe(value)
    })
    test.each([
        0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x87
    ])('ADD(8) reg,reg [%i]', opCode => {
        const { instruction, registers: [ reg1, reg2 ] } = getRegistersFromOpCode(opCode, /ADD (\w+),(\w+)$/)
        
        if (reg1 && reg2) {
            setRegisterValue(reg1, value)
            setRegisterValue(reg2, aux)
            instruction.fn()
            if (reg1 === reg2) {
                // For ADD A,A
                expect(getRegisterValue(reg1)).toBe(int8(aux + aux))
            } else {
                expect(getRegisterValue(reg1)).toBe(int8(value + aux))
            }
        } else {
            throw new TypeError(`Register not found for opCode ${opCode}`)
        }
    })
    test.each([
        0x09, 0x19, 0x29, 0x39
    ])('ADD(16) reg,reg [%i]', opCode => {
        const { instruction, registers: [ reg1, reg2 ] } = getRegistersFromOpCode(opCode, /ADD (\w+),(\w+)$/)

        if (reg1 && reg2) {
            setRegisterValue(reg1, value)
            setRegisterValue(reg2, aux)
            instruction.fn()
            if (reg1 === reg2) {
                // For ADD HL,HL
                expect(getRegisterValue(reg1)).toBe(int16(aux + aux))
            } else {
                expect(getRegisterValue(reg1)).toBe(int16(value + aux))
            }
        } else {
            throw new TypeError(`Register not found for opCode ${opCode}`)
        }
    })
    test.each([
        0x0A, 0x1A, 0x46, 0x4E, 0x56, 0x5E, 0x66, 0x6E, 0x7E
    ])('LD reg,(reg) [%i]', opCode => {
        const { instruction, registers: [ reg1, reg2 ] } = getRegistersFromOpCode(opCode, /LD (\w+),\((\w+)\)$/)

        cpu.mem.store8(value, address)
        setRegisterValue(reg2, address)
        instruction.fn()
        expect(getRegisterValue(reg1)).toBe(value)
    })
    test('NOP', () => expect(cpu.instructions[0x00].fn).not.toThrow())
    test('RLCA', () => {
        cpu.A = value
        cpu.instructions[0x07].fn()
        expect(cpu.A).toBe(-56)
    })
    test('LD (a16),SP', () => {
        cpu.SP = value
        cpu.instructions[0x08].fn(address)
        expect(cpu.mem.load16(address)).toBe(value)
    })    
    test('RRCA', () => {
        cpu.A = value
        cpu.instructions[0x0F].fn()
        expect(cpu.A).toBe(50)
    })
    test('STOP 0', () => {
        cpu.instructions[0x10].fn(0)
        expect(cpu.stopFlag).toBe(true)
    })
    test('RLA', () => {
        cpu.A = value
        cpu.instructions[0x17].fn()
        expect(cpu.A).toBe(int8(200))
    })
    test('JR r8', () => {
        cpu.PC = address
        cpu.instructions[0x18].fn(value)
        expect(cpu.PC).toBe(address + value)
    })
    test('RRA', () => {
        cpu.A = value
        cpu.instructions[0x1F].fn()
        expect(cpu.A).toBe(50)
    })
    test('LD (HL+),A', () => {
        cpu.HL = address
        cpu.A = value
        cpu.instructions[0x22].fn()
        expect(cpu.mem.load8(int16(address + 1))).toBe(value)
        expect(cpu.HL).toBe(address + 1)
    })
    test('DAA', () => {
        /* TODO: Write tests for the other flags */
        const value = 0b00010000 // 10 in BCD

        cpu.A = value
        cpu.B = value
        cpu.instructions[0x90].fn() // SUB B
        cpu.instructions[0x27].fn()
        expect(cpu.flagZ).toBe(1)
    })
    test.each([
        [0x28, 0x38]
    ])('JR flag,r8', opCode => {
        const { instruction, flags: [ flag ] } = getFlagsFromOpCode(opCode, /JR (\w),r8$/)

        setFlag(flag, 1)
        cpu.PC = address
        instruction.fn(value)
        expect(cpu.PC).toBe(address + value)
        
        setFlag(flag, 0)
        cpu.PC = address
        instruction.fn(value)
        expect(cpu.PC).toBe(address)
    })
    test('LD A,(HL+)', () => {
        cpu.HL = address
        cpu.mem.store8(value, cpu.HL)
        cpu.instructions[0x2A].fn()

        expect(cpu.A).toBe(value)
        expect(cpu.HL).toBe(address + 1)
    })
    test('CPL', () => {
        cpu.A = value
        cpu.instructions[0x2F].fn()

        expect(cpu.A).toBe(~value)
    })
    test.each([
        [0x20, 0x30]
    ])('JR Nflag,r8', opCode => {
        const { instruction, flags: [ flag ] } = getFlagsFromOpCode(opCode, /^JR N(\w),r8$/)

        setFlag(flag, 0)
        cpu.PC = address
        instruction.fn(value)
        expect(cpu.PC).toBe(address + value)
        
        setFlag(flag, 1)
        cpu.PC = address
        instruction.fn(value)
        expect(cpu.PC).toBe(address)
    })
    test('LD (HL-),A', () => {
        cpu.HL = address
        cpu.A = value
        cpu.instructions[0x32].fn()

        expect(cpu.mem.load8(address)).toBe(value)
        expect(cpu.HL).toBe(address -1 )
    })
    test('INC (HL)', () => {
        cpu.HL = address
        cpu.mem.store8(value, cpu.HL)
        cpu.instructions[0x34].fn()

        expect(cpu.mem.load8(cpu.HL)).toBe(value + 1)
    })
    test('DEC (HL)', () => {
        cpu.HL = address
        cpu.mem.store8(value, cpu.HL)
        cpu.instructions[0x35].fn()

        expect(cpu.mem.load8(cpu.HL)).toBe(value - 1)
    })
    test('LD (HL),d8', () => {
        cpu.HL = address
        cpu.instructions[0x36].fn(value)

        expect(cpu.mem.load8(cpu.HL)).toBe(value)
    })
    test('SCF', () => {
        cpu.instructions[0x37].fn()
        expect(cpu.flagC).toBe(1)
    }),
    test('LD A,(HL-)', () => {
        cpu.mem.store8(value, int16(address - 1))
        cpu.HL = address
        cpu.instructions[0x3A].fn()
        expect(cpu.A).toBe(value)
        expect(cpu.HL).toBe(address - 1)
    }),
    test('CCF', () => {
        cpu.flagC = 1
        cpu.instructions[0x3F].fn()
        expect(cpu.flagC).toBe(0)
    }),
    test.each([
        [
            0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x47, // LD B, reg
            0x48, 0x49, 0x4A, 0X4B, 0X4C, 0X4D, 0X4F, // LD C, reg
            0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x57, // LD D, reg
            0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x5D, 0x5F, // LD E, reg
            0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x67, // LD H, reg
            0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6F, // LD L, reg
            0x78, 0x79, 0x7A, 0x7B, 0x7C, 0x7D, 0x7F, // LD L, reg
        ]
    ])('LD reg,reg [%i]', opCode => {
        const { instruction, registers: [ reg1, reg2 ] } = getRegistersFromOpCode(opCode, /LD (\w+),(\w+)$/)

        setRegisterValue(reg1, value)
        instruction.fn()
        expect(getRegisterValue(reg2)).toBe(value)
    }),
    test.each([
        [0x46, 0x4E, 0x56, 0x5E, 0x66, 0x6E, 0x7E]
    ])('LD reg,(HL) [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /LD (\w+),\(HL\)$/)

        cpu.HL = address
        cpu.mem.store8(value, address)
        instruction.fn()
        expect(getRegisterValue(register)).toBe(value)
    }),
    test.each([
        [0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x77]
    ])('LD (HL),reg [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /LD \(HL\),(\w+)$/)

        cpu.HL = address
        setRegisterValue(register, value)
        instruction.fn()
        expect(cpu.mem.load8(address)).toBe(value)
    }),
    test('HALT', () => {
        cpu.instructions[0x76].fn()
        expect(cpu.haltFlag).toBe(true)
    })
    test('ADD A,(HL)', () => {
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0x86].fn()
        expect(cpu.A).toBe(value + aux)
    })
    test.each([
        [0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8F]
    ])('ADC A,reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /ADC A,(\w+)$/)

        cpu.flagC = 1
        cpu.A = value
        setRegisterValue(register, aux)
        instruction.fn()
        if (register === 'A') {
            expect(cpu.A).toBe(aux + aux + 1)
        } else {
            expect(cpu.A).toBe(value + aux + 1)
        }
    })
    test('ADC A,(HL)', () => {
        cpu.flagC = 1
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0x8E].fn()
        expect(cpu.A).toBe(value + aux + 1)
    })
    test.each([
        [0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x97]
    ])('SUB reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /SUB (\w+)$/)

        cpu.A = value
        setRegisterValue(register, aux)
        instruction.fn()
        expect(cpu.A).toBe(value - aux)
    })
    test('SUB (HL)', () => {
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0x96].fn()
        expect(cpu.A).toBe(value - aux)
    })
    test.each([
        [0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9F]
    ])('SBC A,reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /SBC A,(\w+)$/)

        cpu.flagC = 1
        cpu.A = value
        setRegisterValue(register, aux)
        instruction.fn()
        expect(cpu.A).toBe(value - aux - 1)
    })
    test('SBC A,(HL)', () => {
        cpu.flagC = 1
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0x9E].fn()
        expect(cpu.A).toBe(value - aux - 1)
    })
    test.each([
        [0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA7]
    ])('AND reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /AND (\w+)$/)

        cpu.A = value
        setRegisterValue(register, aux)
        instruction.fn()
        expect(cpu.A).toBe(value & aux)
    })
    test('AND (HL)', () => {
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0xA6].fn()
        expect(cpu.A).toBe(value & aux)
    })
    test.each([
        [0xA8, 0xA9, 0xAA, 0xAB, 0xAC, 0xAD, 0xAF]
    ])('XOR reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /XOR (\w+)$/)

        cpu.A = value
        setRegisterValue(register, aux)
        instruction.fn()
        expect(cpu.A).toBe(value ^ aux)
    })
    test('XOR (HL)', () => {
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0xAE].fn()
        expect(cpu.A).toBe(value ^ aux)
    })
    test.each([
        [0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB7]
    ])('OR reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /OR (\w+)$/)

        cpu.A = value
        setRegisterValue(register, aux)
        instruction.fn()
        expect(cpu.A).toBe(value | aux)
    })
    test('OR (HL)', () => {
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0xB6].fn()
        expect(cpu.A).toBe(value | aux)
    })
    test.each([
        [0xB8, 0xB9, 0xBA, 0xBB, 0xBC, 0xBD, 0xBF]
    ])('CP reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /CP (\w+)$/)

        cpu.A = value
        setRegisterValue(register, aux)
        instruction.fn()
        if (value === aux) {
            expect(cpu.flagZ).toBe(1)
            expect(cpu.flagC).toBe(0)
        } else if (value > aux) {
            expect(cpu.flagZ).toBe(0)
            expect(cpu.flagC).toBe(0)
        } else {
            expect(cpu.flagZ).toBe(0)
            expect(cpu.flagC).toBe(1)
        }
    })
    test('CP (HL)', () => {
        cpu.A = value
        cpu.HL = address
        cpu.mem.store8(aux, address)
        cpu.instructions[0xBE].fn()
        if (value === aux) {
            expect(cpu.flagZ).toBe(1)
            expect(cpu.flagC).toBe(0)
        } else if (value > aux) {
            expect(cpu.flagZ).toBe(0)
            expect(cpu.flagC).toBe(0)
        } else {
            expect(cpu.flagZ).toBe(0)
            expect(cpu.flagC).toBe(1)
        }
    })
    test.each([
        [0xC0, true], [0xC8, true], [0xD0, true], [0xD8, true],
        [0xC0, false], [0xC8, false], [0xD0, false], [0xD8, false]
    ])('RET cond [%i]', (opCode, flagStatus) => {
        const { instruction, flags: [ flag ] } = getFlagsFromOpCode(opCode, /RET N?(\w)$/)
        const isNegative = /RET N\w$/.test(instruction.name)

        setFlag(flag, flagStatus)
        cpu.PC = 0
        cpu.SP = address - 2
        cpu.mem.store16(auxAddress, address)
        instruction.fn()
        if ((getFlag(flag) && !isNegative) || (!getFlag(flag) && isNegative)) {
            expect(cpu.PC).toBe(auxAddress)
            expect(cpu.SP).toBe(address)
        } else {
            expect(cpu.PC).toBe(0)
        }
    })
    test.each([
        [0xC1, 0xD1, 0xE1, 0xF1]
    ])('POP reg', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /POP (\w+)$/)

        cpu.SP = address
        cpu.mem.store16(int16(value), address)
        instruction.fn()
        expect(getRegisterValue(register)).toBe(value)       
    })
    test.each([
        [0xC2, true], [0xCA, true], [0xD2, true], [0xDA, true],
        [0xC2, false], [0xCA, false], [0xD2, false], [0xDA, false]
    ])('JP cond,a16 [%i]', (opCode, flagStatus) => {
        const { instruction, flags: [ flag ] } = getFlagsFromOpCode(opCode, /JP N?(\w),a16$/)
        const isNegative = /JP N\w,a16$/.test(instruction.name)

        setFlag(flag, flagStatus)
        cpu.PC = 0
        instruction.fn(address)
        if ((getFlag(flag) && !isNegative) || (!getFlag(flag) && isNegative)) {
            expect(cpu.PC).toBe(address)
        } else {
            expect(cpu.PC).toBe(0)
        }
    })
    test('JP a16', () => {
        cpu.instructions[0xC3].fn(address)
        expect(cpu.PC).toBe(address)
    })
    test.each([
        [0xC4, true], [0xCC, true], [0xD4, true], [0xDC, true],
        [0xC4, false], [0xCC, false], [0xD4, false], [0xDC, false]
    ])('CALL cond,a16 [%i]', (opCode, flagStatus) => {
        const initialAddress = address, stackPointer = auxAddress, functionAddress = uint16(0x300)
        const { instruction, flags: [ flag ] } = getFlagsFromOpCode(opCode, /CALL N?(\w),a16$/)
        const isNegative = /CALL N\w,a16$/.test(instruction.name)

        setFlag(flag, flagStatus)
        cpu.PC = initialAddress
        cpu.SP = stackPointer
        instruction.fn(functionAddress)
        if ((getFlag(flag) && !isNegative) || (!getFlag(flag) && isNegative)) {
            expect(cpu.PC).toBe(functionAddress)
            expect(cpu.mem.load16(int16(stackPointer))).toBe(initialAddress)
            expect(cpu.SP).toBe(stackPointer - 2)
        } else {
            expect(cpu.PC).toBe(initialAddress)
        }
    })
    test.each([
        [0xC5, 0xD5, 0xE5, 0xF5]
    ])('PUSH reg [%i]', opCode => {
        const { instruction, registers: [ register ] } = getRegistersFromOpCode(opCode, /PUSH (\w+)$/)

        cpu.SP = address
        setRegisterValue(register, value)
        instruction.fn()
        expect(cpu.mem.load16(address)).toBe(value)
        expect(cpu.SP).toBe(address - 2)
    })
    test.each([
        [0xC7, 0xCF, 0xD7, 0xDF, 0xE7, 0xEF, 0xF7, 0xFF]
    ])('RST address', opCode => {
        const instruction = cpu.instructions[opCode]
        const resetAddress = instruction.name.match(/RST (\d+)h/)

        if (!resetAddress) {
            throw new TypeError(`No address for instruction ${instruction.name} found.`)
        }
        const parsedAddress = parseInt(resetAddress[1], 16)

        cpu.PC = address
        cpu.SP = auxAddress
        instruction.fn()
        expect(cpu.mem.load16(auxAddress)).toBe(address)
        expect(cpu.PC).toBe(parsedAddress)
    })
    test('RET', () => {
        cpu.PC = 0
        cpu.SP = address - 2
        cpu.mem.store16(auxAddress, address)
        cpu.instructions[0xC9].fn()
        expect(cpu.PC).toBe(auxAddress)
    })
    test('PREFIX', () => {
        const spy = jest.spyOn(cpu.instructions[0xCB00 | value], 'fn')

        cpu.PC = address
        cpu.mem.store8(value, address)
        cpu.instructions[0xCB].fn()

        expect(spy).toHaveBeenCalled()
    })
    test.each([
        [0xD3, 0xDB, 0xDD, 0xE3, 0xE4, 0xEB, 0xEC, 0xED, 0xF4, 0xFC, 0xFD]
    ])('Invalid instructions', opCode => {
        expect(() => cpu.instructions[opCode].fn()).toThrow()
    })
    test('DI', () => {
        cpu.instructions[0xF3].fn()
        expect(cpu.interruptEnabled).toBe(false)
    })
})

/**
 * @todo Write tests for the CBxx instructions.
 * These are pretty straightforward and already covered in alu.test.ts
*/
describe.skip('CBxx Instructions', () => {})