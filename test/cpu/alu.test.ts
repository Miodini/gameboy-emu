import Cpu from "../../src/cpu"
import { Bit } from "../../src/types.js"
import { bit, int8, int16 } from "../../src/utils.js"
import { describe, expect, test, beforeEach } from "@jest/globals"

const cpu = new Cpu(new Int8Array(0))

beforeEach(() => {
    // Reset registers before operating
    cpu.AF = 0
    cpu.BC = 0
    cpu.DE = 0
    cpu.HL = 0
})

describe('Arithmethics', () => {
    test.each([
        {a: int8(1), b: int8(2), carry: bit(0), expected: { result: 3, c: 0, h: 0 } },
        {a: int8(1), b: int8(2), carry: bit(1), expected: { result: 4, c: 0, h: 0 }},
        {a: int8(-1), b: int8(3), carry: bit(0), expected: { result: 2, c: 1, h: 1 }},
        {a: int8(14), b: int8(1), carry: bit(1), expected: { result: 16, c: 0, h: 1}},
    ])('adc ($a, $b, carry: $carry)', ({a, b, carry, expected}) => {
        cpu.flagC = carry
        cpu.adc(int8(a), int8(b))

        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: int8(1), b: int8(2), expected: { result: 3, c: 0, h: 0 } },
        {a: int8(-1), b: int8(3), expected: { result: 2, c: 1, h: 1 }},
        {a: int8(14), b: int8(2), expected: { result: 16, c: 0, h: 1}},
    ])('add8 ($a, $b)', ({a, b, expected}) => {
        cpu.add8(int8(a), int8(b))

        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: int16(1), b: int16(2), expected: { result: 3, c: 0, h: 0 } },
        {a: int16(-1), b: int16(3), expected: { result: 2, c: 1, h: 1 }},
        {a: int16(255), b: int16(2), expected: { result: 257, c: 0, h: 1}},
    ])('add16 ($a, $b)', ({a, b, expected}) => {
        const result = int16(cpu.add16(int16(a), int16(b)))

        expect(result).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: int8(3), b: int8(2), expected: { result: 1, c: 0, h: 0 } },
        {a: int8(2), b: int8(3), expected: { result: -1, c: 1, h: 1 }},
        {a: int8(16), b: int8(1), expected: { result: 15, c: 0, h: 1}},
    ])('sub ($a, $b)', ({a, b, expected}) => {
        cpu.A = a
        cpu.sub(int8(b))

        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: int8(2), b: int8(3), carry: bit(0), expected: { result: -1, c: 1, h: 1 } },
        {a: int8(2), b: int8(3), carry: bit(1), expected: { result: -2, c: 1, h: 1 }},
        {a: int8(17), b: int8(1), carry: bit(0), expected: { result: 16, c: 0, h: 0}},
        {a: int8(17), b: int8(1), carry: bit(1), expected: { result: 15, c: 0, h: 1}},
    ])('sbc ($a, $b, carry: $carry)', ({a, b, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.sbc(b)

        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: int8(1), expected: { result: 0, h: 0 } },
        {a: int8(0), expected: { result: -1, h: 1 }},
        {a: int8(16), expected: { result: 15, h: 1}},
    ])('dec($a)', ({a, expected}) => {
        const result = int8(cpu.dec(a))

        expect(result).toBe(expected.result)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: int8(0), expected: { result: 1, h: 0 } },
        {a: int8(-1), expected: { result: 0, h: 1 }},
        {a: int8(15), expected: { result: 16, h: 1}},
    ])('inc($a)', ({a, expected}) => {
        const result = int8(cpu.inc(a))

        expect(result).toBe(expected.result)
        expect(cpu.flagH).toBe(expected.h)
    })
})

describe('Logical', () => {
    test('and', () => {
        cpu.A = 5
        cpu.and(int8(6))
        expect(cpu.A).toBe(4)
    })
    test('or', () => {
        cpu.A = 1
        cpu.or(int8(2))
        expect(cpu.A).toBe(3)
    })
    test('xor', () => {
        cpu.A = 5
        cpu.xor(int8(6))
        expect(cpu.A).toBe(3)
    })
    test('cp', () => {
        cpu.A = 3
        cpu.cp(int8(3))
        expect(cpu.flagZ).toBe(1)
    })
})

describe('Shifts & Rotates', () => {    
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 4, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: 5, c: 0 }},
        {a: int8(-1), carry: bit(0), expected: { result: -2, c: 1}},
        {a: int8(-2), carry: bit(1), expected: { result: -3, c: 1}},
    ])('rl ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(int8(cpu.rl(a))).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 4, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: 5, c: 0 }},
        {a: int8(-1), carry: bit(0), expected: { result: -2, c: 1}},
        {a: int8(-2), carry: bit(1), expected: { result: -3, c: 1}},
    ])('rla ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rla()
        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 4, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: 4, c: 0 }},
        {a: int8(-1), carry: bit(0), expected: { result: -2, c: 1}},
        {a: int8(-2), carry: bit(1), expected: { result: -4, c: 1}},
    ])('rlc ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(int8(cpu.rlc(a))).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 4, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: 4, c: 0 }},
        {a: int8(-1), carry: bit(0), expected: { result: -2, c: 1}},
        {a: int8(-2), carry: bit(1), expected: { result: -4, c: 1}},
    ])('rlca ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rlca()
        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 1, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: int8(0x81), c: 0 }},
        {a: int8(3), carry: bit(0), expected: { result: 1, c: 1}},
        {a: int8(1), carry: bit(1), expected: { result: int8(0x80), c: 1}},
    ])('rr ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(int8(cpu.rr(a))).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 1, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: int8(0x81), c: 0 }},
        {a: int8(3), carry: bit(0), expected: { result: 1, c: 1}},
        {a: int8(1), carry: bit(1), expected: { result: int8(0x80), c: 1}},
    ])('rra ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rra()
        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 1, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: 1, c: 0 }},
        {a: int8(3), carry: bit(0), expected: { result: int8(0x81), c: 1}},
        {a: int8(1), carry: bit(1), expected: { result: int8(0x80), c: 1}},
    ])('rrc ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(int8(cpu.rrc(a))).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), carry: bit(0), expected: { result: 1, c: 0 }},
        {a: int8(2), carry: bit(1), expected: { result: 1, c: 0 }},
        {a: int8(3), carry: bit(0), expected: { result: int8(0x81), c: 1}},
        {a: int8(1), carry: bit(1), expected: { result: int8(0x80), c: 1}},
    ])('rrca ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rrca()
        expect(cpu.A).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), expected: { result: 4, c: 0 }},
        {a: int8(0x81), expected: { result: 2, c: 1 }},
    ])('sla ($a)', ({a, expected}) => {
        expect(int8(cpu.sla(a))).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), expected: { result: 1, c: 0 }},
        {a: int8(0x81), expected: { result: int8(0x80), c: 1 }},
    ])('sra ($a)', ({a, expected}) => {
        expect(int8(cpu.sra(a))).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(2), expected: { result: 1, c: 0 }},
        {a: int8(0x81), expected: { result: int8(0x40), c: 1 }},
    ])('srl ($a)', ({a, expected}) => {
        expect(int8(cpu.srl(a))).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: int8(0x0F), expected: int8(0xF0) },
        {a: int8(0xF0), expected: int8(0x0F) },
        {a: int8(0x3D), expected: int8(0xD3) },
    ])('swap ($a)', ({a, expected}) => {
        expect(int8(cpu.swap(a))).toBe(expected)
    })
})

describe('Bit Op', () => {
    test('bit', () => {
        cpu.bit(0, int8(2))
        expect(cpu.flagZ).toBe(1)
        cpu.bit(1, int8(2))
        expect(cpu.flagZ).toBe(0)
    })
    test('set', () => {
        expect(cpu.set(0, int8(2))).toBe(3)
    })
    test('res', () => {
        expect(cpu.res(0, int8(3))).toBe(2)
    })
})
