/** Important: when testing registers, make sure to cast the `toBe` argument to the same data type (signed vs unsigned) */
import Cpu from '../../src/cpu'
import Memory from '../../src/memory'
import { bit, int8, uint8, int16 } from '../../src/utils.js'
import { describe, expect, test, beforeEach } from '@jest/globals'

const mem = new Memory()
const cpu = new Cpu(mem)

beforeEach(() => {
    // Reset registers before operating
    cpu.AF = 0
    cpu.BC = 0
    cpu.DE = 0
    cpu.HL = 0
})

describe('Arithmethics', () => {
    test.each([
        {a: 1, b: 2, carry: bit(0), expected: { result: 3, c: 0, h: 0 } },
        {a: 1, b: 2, carry: bit(1), expected: { result: 4, c: 0, h: 0 }},
        {a: -1, b: 3, carry: bit(0), expected: { result: 2, c: 1, h: 1 }},
        {a: 14, b: 1, carry: bit(1), expected: { result: 16, c: 0, h: 1}},
    ])('adc ($a, $b, carry: $carry)', ({a, b, carry, expected}) => {
        cpu.flagC = carry
        cpu.adc(int8(a), int8(b))

        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: 1, b: 2, expected: { result: 3, c: 0, h: 0 } },
        {a: -1, b: 3, expected: { result: 2, c: 1, h: 1 }},
        {a: 14, b: 2, expected: { result: 16, c: 0, h: 1}},
    ])('add8 ($a, $b)', ({a, b, expected}) => {
        cpu.add8(int8(a), int8(b))

        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: 1, b: 2, expected: { result: 3, c: 0, h: 0 } },
        {a: -1, b: 3, expected: { result: 2, c: 1, h: 1 }},
        {a: 255, b: 2, expected: { result: 257, c: 0, h: 1}},
    ])('add16 ($a, $b)', ({a, b, expected}) => {
        const result = cpu.add16(int16(a), int16(b))

        expect(result).toBe(expected.result)
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: 3, b: 2, expected: { result: 1, c: 0, h: 0 } },
        {a: 2, b: 3, expected: { result: -1, c: 1, h: 1 }},
        {a: 16, b: 1, expected: { result: 15, c: 0, h: 1}},
    ])('sub ($a, $b)', ({a, b, expected}) => {
        cpu.A = a
        cpu.sub(int8(b))

        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: 2, b: 3, carry: bit(0), expected: { result: -1, c: 1, h: 1 } },
        {a: 2, b: 3, carry: bit(1), expected: { result: -2, c: 1, h: 1 }},
        {a: 17, b: 1, carry: bit(0), expected: { result: 16, c: 0, h: 0}},
        {a: 17, b: 1, carry: bit(1), expected: { result: 15, c: 0, h: 1}},
    ])('sbc ($a, $b, carry: $carry)', ({a, b, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.sbc(int8(b))

        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: 1, expected: { result: 0, h: 0 } },
        {a: 0, expected: { result: -1, h: 1 }},
        {a: 16, expected: { result: 15, h: 1}},
    ])('dec($a)', ({a, expected}) => {
        const result = int8(cpu.dec(int8(a)))

        expect(result).toBe(expected.result)
        expect(cpu.flagH).toBe(expected.h)
    })
    test.each([
        {a: 0, expected: { result: 1, h: 0 } },
        {a: -1, expected: { result: 0, h: 1 }},
        {a: 15, expected: { result: 16, h: 1}},
    ])('inc($a)', ({a, expected}) => {
        const result = int8(cpu.inc(int8(a)))

        expect(result).toBe(expected.result)
        expect(cpu.flagH).toBe(expected.h)
    })
})

describe('Logical', () => {
    test('and', () => {
        cpu.A = 5
        cpu.and(uint8(6))
        expect(cpu.A).toBe(4)
    })
    test('or', () => {
        cpu.A = 1
        cpu.or(uint8(2))
        expect(cpu.A).toBe(3)
    })
    test('xor', () => {
        cpu.A = 5
        cpu.xor(uint8(6))
        expect(cpu.A).toBe(3)
    })
    test('cp', () => {
        cpu.A = 3
        cpu.cp(uint8(3))
        expect(cpu.flagZ).toBe(1)
    })
})

describe('Shifts & Rotates', () => {    
    test.each([
        {a: 2, carry: bit(0), expected: { result: 4, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 5, c: 0 }},
        {a: -1, carry: bit(0), expected: { result: -2, c: 1}},
        {a: -2, carry: bit(1), expected: { result: -3, c: 1}},
    ])('rl ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(cpu.rl(uint8(a))).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, carry: bit(0), expected: { result: 4, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 5, c: 0 }},
        {a: -1, carry: bit(0), expected: { result: -2, c: 1}},
        {a: -2, carry: bit(1), expected: { result: -3, c: 1}},
    ])('rla ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rla()
        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, carry: bit(0), expected: { result: 4, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 4, c: 0 }},
        {a: -1, carry: bit(0), expected: { result: -2, c: 1}},
        {a: -2, carry: bit(1), expected: { result: -4, c: 1}},
    ])('rlc ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(cpu.rlc(uint8(a))).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, carry: bit(0), expected: { result: 4, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 4, c: 0 }},
        {a: -1, carry: bit(0), expected: { result: -2, c: 1}},
        {a: -2, carry: bit(1), expected: { result: -4, c: 1}},
    ])('rlca ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rlca()
        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, carry: bit(0), expected: { result: 1, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 0x81, c: 0 }},
        {a: 3, carry: bit(0), expected: { result: 1, c: 1}},
        {a: 1, carry: bit(1), expected: { result: 0x80, c: 1}},
    ])('rr ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(cpu.rr(uint8(a))).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, carry: bit(0), expected: { result: 1, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 0x81, c: 0 }},
        {a: 3, carry: bit(0), expected: { result: 1, c: 1}},
        {a: 1, carry: bit(1), expected: { result: 0x80, c: 1}},
    ])('rra ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rra()
        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, carry: bit(0), expected: { result: 1, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 1, c: 0 }},
        {a: 3, carry: bit(0), expected: { result: 0x81, c: 1}},
        {a: 1, carry: bit(1), expected: { result: 0x80, c: 1}},
    ])('rrc ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.flagC = carry
        expect(cpu.rrc(uint8(a))).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, carry: bit(0), expected: { result: 1, c: 0 }},
        {a: 2, carry: bit(1), expected: { result: 1, c: 0 }},
        {a: 3, carry: bit(0), expected: { result: 0x81, c: 1}},
        {a: 1, carry: bit(1), expected: { result: 0x80, c: 1}},
    ])('rrca ($a) carry: $carry', ({a, carry, expected}) => {
        cpu.A = a
        cpu.flagC = carry
        cpu.rrca()
        expect(cpu.A).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, expected: { result: 4, c: 0 }},
        {a: 0x81, expected: { result: 2, c: 1 }},
    ])('sla ($a)', ({a, expected}) => {
        expect(cpu.sla(uint8(a))).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, expected: { result: 1, c: 0 }},
        {a: 0x81, expected: { result: uint8(0x80), c: 1 }},
    ])('sra ($a)', ({a, expected}) => {
        expect(cpu.sra(uint8(a))).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 2, expected: { result: 1, c: 0 }},
        {a: 0x81, expected: { result: 0x40, c: 1 }},
    ])('srl ($a)', ({a, expected}) => {
        expect(cpu.srl(uint8(a))).toBe(uint8(expected.result))
        expect(cpu.flagC).toBe(expected.c)
    })
    test.each([
        {a: 0x0F, expected: 0xF0 },
        {a: 0xF0, expected: 0x0F },
        {a: 0x3D, expected: 0xD3 },
    ])('swap ($a)', ({a, expected}) => {
        expect(cpu.swap(uint8(a))).toBe(uint8(expected))
    })
})

describe('Bit Op', () => {
    test('bit', () => {
        cpu.bit(0, uint8(2))
        expect(cpu.flagZ).toBe(1)
        cpu.bit(1, uint8(2))
        expect(cpu.flagZ).toBe(0)
    })
    test('set', () => {
        expect(cpu.set(0, uint8(2))).toBe(3)
    })
    test('res', () => {
        expect(cpu.res(0, uint8(3))).toBe(2)
    })
})
