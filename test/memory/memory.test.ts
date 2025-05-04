import Memory from '../../src/memory/memory'
import { int8, int16, uint16 } from '../../src/utils'
import { describe, expect, test, beforeEach } from '@jest/globals'

describe('Memory', () => {
  const value8 = int8(60), value16 = int16(512), address = uint16(0x1000)
  let memory: Memory

  beforeEach(() => {
    memory = new Memory()
  })

  test('load8', () => {
    memory.ram[address] = value8

    expect(memory.load8(address)).toBe(value8)
  })
  test('load16', () => {
    memory.ram[address] = int8((value16 & 0xFF00) >> 8)
    memory.ram[address + 1] = int8(value16 & 0x00FF)

    expect(memory.load16(address)).toBe(value16)
  })
  test('store8', () => {
    memory.store8(value8, address)

    expect(memory.ram[address]).toBe(value8)
  })
  test('store16', () => {
    memory.store16(value16, address)

    expect((memory.ram[address] << 8) | memory.ram[address + 1]).toBe(value16)
  })
})