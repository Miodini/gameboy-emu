import type { IMemory } from "../memory/types"
import type { IPpu, IBgPpu, IObjectPpu } from "./types"
import BgPpu from "./bgPpu"
import ObjectPpu from "./objectPpu"
import { Addresses, Colors, Sizes } from "./constants"
import { pkmnVramDump, pkmnOamDump } from '../../mock/mocks'
import { getBit, uint8, uint16 } from "../utils"

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

  /* The draw method of `bgPpu` and `objPpu` return arrays with color data
   * This method is the responsible for drawing the rects on the actual canvas
  */
  public draw = () => {
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

    this.mem.LY++
    if (this.mem.LY > Sizes.SCREEN_HEIGHT) {
      this.mem.LY = uint8(0)
    }
  }

  public _test = () => {
    this.mem.SCX = uint8(0)
    this.mem.SCY = uint8(0)
    this.mem.LCDC = uint8(0xeb)

    pkmnVramDump.forEach((byte, index) => {
      this.mem.store8(uint8(byte), uint16(Addresses.VRAM + index))
    })
    pkmnOamDump.forEach((byte, index) => {
      this.mem.store8(uint8(byte), uint16(Addresses.OAM + index))
    })

    this.draw()
  } 
}