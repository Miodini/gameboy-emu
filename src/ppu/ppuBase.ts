import type Memory from '../memory'
import { Sizes } from './constants'

export default abstract class PpuBase {
  abstract readonly colorMap: {
    0: string | null,
    1: string | null,
    2: string | null,
    3: string | null 
  }
  readonly mem: Memory
  readonly canvas: HTMLCanvasElement
  readonly pixelSize: number
 
  constructor (mem: Memory, canvas: HTMLCanvasElement, pixelSize: number) {
    this.mem = mem
    this.canvas = canvas
    this.pixelSize = pixelSize
  }

  get canvasCtx () {
    const context = this.canvas.getContext('2d')

    if (!context) {
      throw new Error('Failed to get 2D context from canvas')
    }
    return context
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
    const colorArray: (string | null)[] = []
  
    for (let i = 0; i < 8; i++) {
      const lowBit = (lowByte >> (7 - i)) & 1
      const highBit = (highByte >> (7 - i)) & 1
      const colorIndex = (highBit << 1) | lowBit

      colorArray.push(this.getColor(colorIndex))
    }

    return colorArray
  }

  protected drawPixel (color: string | null, x: number, y: number) {
    // Objects may contain transparent pixels. Skip drawing in this case
    if (color === null) {
      return
    }
    const scrollOffsetX = (x - this.mem.SCX) % Sizes.SCREEN_WIDTH
    const scrollOffsetY = (y - this.mem.SCY) % Sizes.SCREEN_HEIGHT
    // SCX and SCY are the scroll registers
    const screenX = scrollOffsetX * this.pixelSize
    const screenY = scrollOffsetY * this.pixelSize

    this.canvasCtx.fillStyle = color
    this.canvasCtx.fillRect(screenX, screenY, this.pixelSize, this.pixelSize)
  }

  protected drawTile (tileData: number[], x: number, y: number) {
    let xCurrent = x, yCurrent = y

    for (let i = 0; i < tileData.length; i += 2) {
      const lowByte = tileData[i], highByte = tileData[i + 1]  
      const colorArray = this.getTileRow(lowByte, highByte)

      colorArray.forEach(color => {
        this.drawPixel(color, xCurrent, yCurrent)
        xCurrent++
        if (xCurrent >= x + Sizes.TILE_PIXELS) {
          xCurrent = x
          yCurrent++
        }
      })
    }
  }
}