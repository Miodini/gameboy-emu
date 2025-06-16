/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<html><body><div id=\"screen\"></div></body></html>"}
 */
import 'jest-canvas-mock'
import { describe, expect, it } from '@jest/globals'
import Memory from '../../src/memory'
import Ppu from '../../src/ppu'

describe('BgPpu', () => {
  const mem = new Memory()
  const bgPpu = new Ppu(mem)

  it('should render a test screen', () => {
    expect(document.querySelector('#screen > canvas')).not.toBeNull()
    expect(bgPpu._test).not.toThrow()
  })
})
