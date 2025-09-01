import type { IMemory } from '../memory/types'
import type { IBgPpu } from './types'
import PpuBase from './ppuBase'
import { Addresses, Colors, Sizes } from './constants'
import { getBit, uint8, uint16 } from '../../utils'

export default class BgPpu extends PpuBase implements IBgPpu {
  constructor (mem: IMemory) {
    const screenMatrix: Colors[][] = new Array(Sizes.SCREEN_HEIGHT)

    for (let i = 0; i < Sizes.SCREEN_HEIGHT; i++) {
      screenMatrix[i] = new Array(Sizes.SCREEN_WIDTH).fill(Colors.WHITE)
    }
    super(mem, screenMatrix)
  }

  /** Draws a screen-full of tiles. Some are displayed outside of the screen boundaries */
  public draw (): (Colors | null)[][] {
    let screenX = 0, screenY = 0
    const selectedTileMap = getBit(this.mem.LCDC, 3) === 0 ? 0 : 1
    const selectedTileData = getBit(this.mem.LCDC, 4) === 0 ? 1 : 0
    const tileDataAddress = selectedTileData === 0 ? Addresses.TILE_DATA_BLOCK_0 : Addresses.TILE_DATA_BLOCK_2
    const tileMapAddress = selectedTileMap === 0 ? Addresses.TILE_MAP_0 : Addresses.TILE_MAP_1
    
    for (let tileX = 0; tileX < Sizes.TILE_MAP; tileX++) {
      for (let tileY = 0; tileY < Sizes.TILE_MAP; tileY++) {
        const tileData: number[] = []
        let tileIndex = this.mem.load8(uint16(tileMapAddress + tileX * Sizes.TILE_MAP + tileY))

        if (selectedTileData === 1) {
          tileIndex = uint8(tileIndex) // Convert to signed 8-bit integer
        }
        
        for (let i = 0; i < Sizes.TILE_DATA; i++) {
          tileData.push(this.mem.load8(uint16(tileDataAddress + (tileIndex * Sizes.TILE_DATA) + i)))
        }
        this.drawTile(tileData, screenX, screenY)
        screenX += Sizes.TILE_PIXELS
      }
      screenX = 0
      screenY += Sizes.TILE_PIXELS
    }

    return this.screenMatrix
  }
}