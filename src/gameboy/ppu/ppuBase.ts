import type { IMemory } from '../memory/types'
import { Colors, Sizes } from './constants'

export default abstract class PpuBase {
  constructor (public readonly mem: IMemory, public readonly screenMatrix: (Colors | null)[][]) {}

  protected getColor (value: number): Colors | null {
    switch (value) {
      case 0:
        return Colors.WHITE
      case 1:
        return Colors.LIGHT_GRAY
      case 2:
        return Colors.DARK_GRAY
      case 3:
        return Colors.BLACK
      default:
        return Colors.WHITE
    }
  }

  protected getTileRow (lowByte: number, highByte: number) {
    const colorArray: (Colors | null)[] = []
  
    for (let i = 0; i < 8; i++) {
      const lowBit = (lowByte >> (7 - i)) & 1
      const highBit = (highByte >> (7 - i)) & 1
      const colorIndex = (highBit << 1) | lowBit
      const color = this.getColor(colorIndex)

      colorArray.push(color)
    }

    return colorArray
  }

  protected drawPixel (color: Colors, x: number, y: number) {
    const scrollOffsetX = (x - this.mem.SCX) % Sizes.SCREEN_WIDTH
    const scrollOffsetY = (y - this.mem.SCY) % Sizes.SCREEN_HEIGHT
    // SCX and SCY are the scroll registers
    const screenX = scrollOffsetX
    const screenY = scrollOffsetY

    this.screenMatrix[screenX][screenY] = color
  }

  protected drawTile (tileData: number[], x: number, y: number, { flipX = false, flipY = false } = {}) {
    let xCurrent = x, yCurrent = y

    if (flipX) {
      xCurrent = x + Sizes.TILE_PIXELS - 1
    }
    if (flipY) {
      yCurrent = y + Sizes.TILE_PIXELS - 1
    }
    // Loops in reverse order if flipY is true
    for (let i = 0; i < tileData.length; i += 2) {
      const lowByte = tileData[i], highByte = tileData[i + 1]  
      const colorArray = this.getTileRow(lowByte, highByte)

      colorArray.forEach(color => {
        if (color !== null) {
          this.drawPixel(color, xCurrent, yCurrent)
        }
        xCurrent += flipX ? -1 : 1
        if (flipX) {
          if (xCurrent < x) {
            xCurrent = x + Sizes.TILE_PIXELS - 1
            yCurrent += flipY ? -1 : 1
          }
        } else if (xCurrent >= x + Sizes.TILE_PIXELS) {
          xCurrent = x
          yCurrent += flipY ? -1 : 1
        }
      })
    }
  }
}