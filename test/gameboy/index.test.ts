/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<html><body><div id=\"screen\"></div></body></html>"}
 */
import { beforeAll, describe, expect, it, test, jest } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getBit, setBit, resetBit, uint16 } from '../../src/utils'
import GameBoy from '../../src/gameboy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const canvas = document.createElement('canvas')
let gameBoy: GameBoy

jest.useFakeTimers()
beforeAll(() => {
  gameBoy = new GameBoy(canvas.transferControlToOffscreen?.(), 4)
})

describe('Main test', () => {
  it('should run the test program', () => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, '../testprogram.bin'))

    gameBoy.loadRom(new Uint8Array(fileContent))
    gameBoy.start()
    jest.advanceTimersByTime(1000)
    gameBoy.stop()
    expect(gameBoy.cpu.A).toBe(8)
    expect(gameBoy.mem.load8(uint16(0xC000))).toBe(8)
  })
})

describe('Timer Interrupts', () => {
    test('Timer interrupt', () => {
      gameBoy.mem.TAC = setBit(gameBoy.mem.TAC, 2) // Enable timer
  
      gameBoy.start()
      jest.advanceTimersByTime(1000)
      gameBoy.stop()
      expect(getBit(gameBoy.mem.IF, 2)).toBe(1)
    })
})