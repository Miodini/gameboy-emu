/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<html><body><div id=\"screen\"></div></body></html>"}
 */
import 'jest-canvas-mock'
import { describe, expect, it } from '@jest/globals'
import Memory from '../../src/memory'
import Ppu from '../../src/ppu'

// TODO: Find a way to test offscreen canvas
describe.skip('BgPpu', () => {
  it('should render a test screen', () => {
    const mem = new Memory()
    const canvas = document.createElement('canvas')
    const bgPpu = new Ppu(mem, canvas.transferControlToOffscreen())

    expect(document.querySelector('#screen > canvas')).not.toBeNull()
    expect(bgPpu._test).not.toThrow()
  })
})
