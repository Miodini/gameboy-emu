import { beforeAll, describe, expect, it } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Cpu from '../src/cpu'
import Memory from '../src/memory'
import { uint16 } from '../src/utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
let cpu: Cpu

beforeAll(() => {
  const fileContent = fs.readFileSync(path.resolve(__dirname, './testprogram.bin'))
  const memory = new Memory()

  cpu = new Cpu(memory)
  cpu.mem.rom = new Uint8Array(fileContent)
})

describe('Main test', () => {
  it('should run the test program', () => {
    for (let i = 0; i < 100; i++) {
      cpu.execute()
    }

    expect(cpu.A).toBe(8)
    expect(cpu.mem.load8(uint16(0xC000))).toBe(8)
  })
})