/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<html><body><div id=\"screen\"></div></body></html>"}
 */
import 'jest-canvas-mock'
import { describe, expect, it } from '@jest/globals'
import Ppu from '../../../src/gameboy/ppu'
import Memory from '../../../src/gameboy/memory'
import { getBit, setBit } from '../../../src/utils'

const canvas = document.createElement('canvas')
const mem = new Memory()
// NOTE: not able to run transferControlToOffscreen on current jest config
const ppu = new Ppu(mem, canvas.transferControlToOffscreen?.())

describe('PPU Interrupts', () => {
    it('should set the V-Blank interrupt flag', () => {
        mem.LY = 143
        ppu.drawScanLine()
    
        expect(getBit(mem.IF, 0)).toBe(1)
    })
    it('should set the LY=LYC interrupt flag', () => {
        mem.LY = 100
        mem.LYC = mem.LY + 1
        mem.STAT = setBit(mem.STAT, 6)
        ppu.drawScanLine()

        expect(getBit(mem.STAT, 2)).toBe(1)
        expect(getBit(mem.IF, 1)).toBe(1)
    })
})