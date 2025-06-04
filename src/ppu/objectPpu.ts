import PpuBase from './ppuBase'
import Memory from '../memory'
import { Addresses, Sizes } from './constants'
import { getBit, uint8, uint16 } from '../utils'

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

  /** Draws objects (sprites) as defined in OAM 
   * TODO: Implement sprite priority
  */
  public draw () {
    const is8x16 = getBit(this.mem.LCDC, 2) === 1

    for (let i = 0; i < Sizes.OAM_ENTRIES * Sizes.OAM_ENTRY_SIZE; i += Sizes.OAM_ENTRY_SIZE) {
      const oamAddress = uint16(Addresses.OAM + i)

      const y = uint8(this.mem.load8(oamAddress) - 16)
      const x = uint8(this.mem.load8(uint16(oamAddress + 1)) - 8)
      const originalTileIndex = uint8(this.mem.load8(uint16(oamAddress + 2)))
      const attributes = this.mem.load8(uint16(oamAddress + 3))
      const flipX = getBit(attributes, 5) === 1
      const flipY = getBit(attributes, 6) === 1
      let tileData: number[] = []
      // Ignoring palette for now

      // Adjust tileIndex for 8x16 sprite modes
      let tileIndex = is8x16 ? originalTileIndex & 0xFE : originalTileIndex

      for (let j = 0; j < Sizes.TILE_DATA; j++) {
        tileData.push(this.mem.load8(uint16(Addresses.TILE_DATA_BLOCK_0 + (tileIndex * Sizes.TILE_DATA) + j)))
      }

      this.drawTile(tileData, x, y, {flipX, flipY})
      
      if (is8x16) {
        // Bottom tile
        tileData = []
        tileIndex = originalTileIndex | 0x01

        for (let j = 0; j < Sizes.TILE_DATA; j++) {
          tileData.push(this.mem.load8(uint16(Addresses.TILE_DATA_BLOCK_0 + (tileIndex * Sizes.TILE_DATA) + j)))
        }

        this.drawTile(tileData, x, y + Sizes.TILE_PIXELS, {flipX, flipY})
      }
    }
  }
}