import PpuBase from './ppuBase'
import Memory from '../memory'
import { Addresses, Sizes } from './constants'
import { getBit, uint16 } from '../utils'

export default class ObjectPpu extends PpuBase {
  readonly colorMap = {
    0: null, // Transparent
    1: '#AAAAAA',
    2: '#858585',
    3: '#000000' 
  }

  constructor (mem: Memory, canvas: HTMLCanvasElement, pixelSize: number) {
    super(mem, canvas, pixelSize)
  }

  /** Draws objects (sprites) as defined in OAM */
  public draw () {
    for (let i = 0; i < Sizes.OAM_ENTRIES; i += Sizes.OAM_ENTRY_SIZE) {
      const oamAddress = uint16(Addresses.OAM + i)

      const y = this.mem.load8(oamAddress) + 16
      const x = this.mem.load8(uint16(oamAddress + 1)) - 8
      const tileIndex = this.mem.load8(uint16(oamAddress + 2))
      const attributes = this.mem.load8(uint16(oamAddress + 3))
      // Ignoring palette for now

      const tileData: number[] = []

      for (let j = 0; j < Sizes.TILE_DATA; j++) {
        tileData.push(this.mem.load8(uint16(Addresses.TILE_DATA_BLOCK_0 + (tileIndex * Sizes.TILE_DATA) + j)))
      }

      this.drawTile(tileData, x, y, { flipX: getBit(attributes, 6) === 1, flipY: getBit(attributes, 7) === 1})
    }
  }
}