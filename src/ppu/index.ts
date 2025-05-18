import type Memory from '../memory'
import { int8, uint16 } from '../utils'
import { Addresses, Sizes } from './constants'

export default class Ppu {
  protected readonly _canvas: HTMLCanvasElement
  protected readonly mem: Memory
  protected x = 0 // x coordinate of the pixel in GameBoy units
  protected y = 0 // x coordinate of the pixel in GameBoy units
  readonly colorMap = {
    0: '#FFFFFF',
    1: '#AAAAAA',
    2: '#858585',
    3: '#000000' 
  }
  readonly pixelSize = 5

  constructor (memoryInstance: Memory) {
    this.mem = memoryInstance
    this._canvas = document.createElement('canvas')
    this._canvas.width = Sizes.VISIBLE_SCREEN_WIDTH * this.pixelSize
    this._canvas.height = Sizes.VISIBLE_SCREEN_HEIGHT * this.pixelSize
    document.getElementById('screen')?.appendChild(this._canvas)
  }

  get canvas () {
    return this._canvas.getContext('2d') || new CanvasRenderingContext2D() // For type safety
  }

  protected getColor (value: number) {
    switch (value) {
      case 0:
        return this.colorMap[0]
      case 1:
        return this.colorMap[1]
      case 2:
        return this.colorMap[2]
      case 3:
        return this.colorMap[3]
      default:
        return this.colorMap[0]
    }
  }

  protected getTileRow (lowByte: number, highByte: number) {
    const colorArray: string[] = []
  
    for (let i = 0; i < 8; i++) {
      const lowBit = (lowByte >> (7 - i)) & 1
      const highBit = (highByte >> (7 - i)) & 1
      const colorIndex = (highBit << 1) | lowBit

      colorArray.push(this.getColor(colorIndex))
    }

    return colorArray
  }

  protected drawPixel (color: string) {
    const scrollOffsetX = (this.x - this.mem.SCX) % Sizes.SCREEN_WIDTH
    const scrollOffsetY = (this.y - this.mem.SCY) % Sizes.SCREEN_WIDTH
    // SCX and SCY are the scroll registers
    const screenX = scrollOffsetX * this.pixelSize
    const screenY = scrollOffsetY * this.pixelSize

    this.canvas.fillStyle = color
    this.canvas.fillRect(screenX, screenY, this.pixelSize, this.pixelSize)
    this.x++
  }

  protected drawTile (tileData: number[]) {
    const startingX = this.x
    const startingY = this.y

    for (let i = 0; i < tileData.length; i += 2) {
      const lowByte = tileData[i], highByte = tileData[i + 1]  
      const colorArray = this.getTileRow(lowByte, highByte)

      colorArray.forEach(color => {
        this.drawPixel(color)
        if (this.x >= startingX + Sizes.TILE_PIXELS) {
          this.x = startingX
          this.y++
        }
      })
    }
    // Set the x and y back to the starting position for the next tile
    this.x = startingX + Sizes.TILE_PIXELS
    this.y = startingY
  }

  /**
   * @param selectedTileData 0 corresponds to Block 0 and Block 1 ($8000-$8FFF), 1 corresponds to Block 3 and Block 2 ($9000-$97FF and $8800-$8FFF)
   * @param selectedTileMap 0 corresponds to $9800-$9BFF, 1 corresponds to $9C00-$9FFF
   * @see {@link https://gbdev.io/pandocs/Tile_Maps.html}
   */
  protected draw (selectedTileData: 0 | 1, selectedTileMap: 0 | 1) {
    const tileDataAddress = selectedTileData === 0 ? Addresses.TILE_DATA_BLOCK_0 : Addresses.TILE_DATA_BLOCK_2
    const tileMapAddress = selectedTileMap === 0 ? Addresses.TILE_MAP_0 : Addresses.TILE_MAP_1
    
    // Load a screen-full of tiles. Some are displayed outside of the screen boundaries
    for (let x = 0; x < Sizes.TILE_MAP; x++) {
      for (let y = 0; y < Sizes.TILE_MAP; y++) {
        const tileData: number[] = []
        let tileIndex = this.mem.load8(uint16(tileMapAddress + x*Sizes.TILE_MAP + y))
        if (selectedTileData === 1) {
          tileIndex = int8(tileIndex) // Convert to signed 8-bit integer
        }
        
        for (let i = 0; i < Sizes.TILE_DATA; i++) {
          tileData.push(this.mem.load8(uint16(tileDataAddress + (tileIndex * Sizes.TILE_DATA) + i)))
        }
        this.drawTile(tileData)
      }
      this.x = 0
      this.y += Sizes.TILE_PIXELS
    }
  }
}