import type { IMemory } from "../memory/types"
import type { IPpu, IBgPpu, IObjectPpu } from "./types"
import BgPpu from "./bgPpu"
import ObjectPpu from "./objectPpu"
import { Colors, Sizes } from "./constants"
import { getBit, setBit, uint8 } from "../../utils"

export default class Ppu implements IPpu {
  private readonly mem: IMemory
  private readonly bgPpu: IBgPpu
  private readonly objPpu: IObjectPpu
  private readonly canvas: OffscreenCanvas
  private readonly colorMap = {
    [Colors.WHITE]: '#FFFFFF',
    [Colors.LIGHT_GRAY]: '#AAAAAA',
    [Colors.DARK_GRAY]: '#858585',
    [Colors.BLACK]: '#000000' 
  } as const
  private pixelSize: number

  constructor (memoryInstance: IMemory, canvas: OffscreenCanvas, pixelSize: number = 5) {
    this.canvas = canvas
    this.pixelSize = pixelSize

    this.mem = memoryInstance
    this.bgPpu = new BgPpu(memoryInstance)
    this.objPpu = new ObjectPpu(memoryInstance)
  }

  get canvasCtx () {
    const context = this.canvas.getContext('2d')

    if (!context) {
      throw new Error('Failed to get 2D context from canvas')
    }
    return context
  }

  /** Increases the LY register (vertical line), and updates related flags */
  private updateLy () {
    this.mem.LY++

    if (this.mem.LY === this.mem.LYC) {
      this.mem.STAT = setBit(this.mem.STAT, 2)
      
      // If LYC int select is enabled, fires an LCD interrupt
      if (getBit(this.mem.STAT, 6)) {
        this.mem.IF = setBit(this.mem.IF, 1)
      }
    }
    if (this.mem.LY === 144) {
      // Enable V-Blank interrupt flag
      this.mem.IF = setBit(this.mem.IF, 0)
    } else if (this.mem.LY > Sizes.SCREEN_HEIGHT) {
      // End of V-Blank period
      this.mem.LY = 0
    }
  }

  /* The draw method of `bgPpu` and `objPpu` return arrays with color data.\
   * This method is the responsible for drawing the rects on the actual canvas.\
   * Each call draws one scanline, according to the current value of Memory.LY
  */
  public drawScanLine = () => {
    if (getBit(this.mem.LCDC, 7) === 1) {
      const bgScreenMatrix = this.bgPpu.draw()
      const objScreenMatrix = this.objPpu.draw()
      const y = this.mem.LY
      // The background becomes white if LCDC bit 0 is not set
      const bgEnable = getBit(this.mem.LCDC, 0) === 1
  
      for (let x = 0; x < Sizes.SCREEN_WIDTH; x++) {
        const color = bgScreenMatrix[x][y]
  
        if (color !== null) {
          this.canvasCtx.fillStyle = bgEnable ? this.colorMap[color] : this.colorMap[Colors.WHITE]
          this.canvasCtx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize)
        }
      }
  
      // Skips drawing the object if LCDC bit 1 is not set. This is checked once per scanline
      if (getBit(this.mem.LCDC, 1) === 1) {
        for (let x = 0; x < Sizes.SCREEN_WIDTH; x++) {
          const color = objScreenMatrix[x][y]
  
          if (color !== null) {
            this.canvasCtx.fillStyle = this.colorMap[color]
            this.canvasCtx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize)
          }
        }
      }
    }

    this.updateLy()
  }
}