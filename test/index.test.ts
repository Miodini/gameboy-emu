import { beforeAll, describe, expect, it } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Cpu from '../src/cpu'
import { uint16 } from '../src/utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
let cpu: Cpu

beforeAll(() => {
  const fileContent = fs.readFileSync(path.resolve(__dirname, './testprogram.bin'))
  const program = Int8Array.from(fileContent)

  cpu = new Cpu(program)
})

describe('Main test', () => {
  it('should run the test program', () => {
    cpu.start()

    expect(cpu.A).toBe(8)
    expect(cpu.mem.load8(uint16(0xC000))).toBe(8)
  })
})