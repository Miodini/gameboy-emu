import Cpu from "../../src/cpu"
import { describe, expect, test } from "@jest/globals"

describe('Flags', () => {
    const registers = new Cpu(new Int8Array(0))
    
    test('Set', () => {
        registers.flagZ = 1
        registers.flagN = 1
        registers.flagH = 1
        registers.flagC = 1
        expect(registers.flagZ).toBe(1)
        expect(registers.flagN).toBe(1)
        expect(registers.flagH).toBe(1)
        expect(registers.flagC).toBe(1)
    })
    test('Reset', () => {
        registers.flagZ = 0
        registers.flagN = 0
        registers.flagH = 0
        registers.flagC = 0
        expect(registers.flagZ).toBe(0)
        expect(registers.flagN).toBe(0)
        expect(registers.flagH).toBe(0)
        expect(registers.flagC).toBe(0)
    })
})

describe('8Bit registers', () => {
    const registers = new Cpu(new Int8Array(0))

    test('A', () => {
        registers.A = 17
        expect(registers.A).toBe(17)
    })
    test('B', () => {
        registers.B = 17
        expect(registers.B).toBe(17)
    })
    test('C', () => {
        registers.C = 17
        expect(registers.C).toBe(17)
    })
    test('D', () => {
        registers.D = 17
        expect(registers.D).toBe(17)
    })
    test('E', () => {
        registers.E = 17
        expect(registers.E).toBe(17)
    })
    test('H', () => {
        registers.H = 17
        expect(registers.H).toBe(17)
    })
    test('L', () => {
        registers.L = 17
        expect(registers.L).toBe(17)
    })
})

describe('16bit registers', () => {
    const registers = new Cpu(new Int8Array(0))

    test('AF', () => {
        registers.AF = 743
        expect(registers.AF).toBe(743)
    })
    test('BC', () => {
        registers.BC = 743
        expect(registers.BC).toBe(743)
    })
    test('DE', () => {
        registers.DE = 743
        expect(registers.DE).toBe(743)
    })
    test('HL', () => {
        registers.HL = 743
        expect(registers.HL).toBe(743)
    })
    test('SP', () => {
        registers.SP = 743
        expect(registers.SP).toBe(743)
    })
    test('PC', () => {
        registers.PC = 743
        expect(registers.PC).toBe(743)
    })
})