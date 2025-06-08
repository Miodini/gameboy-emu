import Memory from "../memory"
import BgPpu from "./bgPpu"
import ObjectPpu from "./objectPpu"
import { Addresses, Colors, Sizes } from "./constants"
import { pkmnVramDump, pkmnOamDump } from '../../mock/mocks'
import { getBit, int8, uint16 } from "../utils"

export default class Ppu {
  private readonly mem: Memory
  private readonly bgPpu: BgPpu
  private readonly objPpu: ObjectPpu
  private readonly canvas = document.createElement('canvas')
  private readonly colorMap = {
    [Colors.WHITE]: '#FFFFFF',
    [Colors.LIGHT_GRAY]: '#AAAAAA',
    [Colors.DARK_GRAY]: '#858585',
    [Colors.BLACK]: '#000000' 
  } as const
  readonly pixelSize = 5

  constructor (memoryInstance: Memory) {
    this.canvas.width = Sizes.VISIBLE_SCREEN_WIDTH * this.pixelSize
    this.canvas.height = Sizes.VISIBLE_SCREEN_HEIGHT * this.pixelSize
    document.getElementById('screen')?.appendChild(this.canvas)

    
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

  public draw () {
    /* The draw method of `bgPpu` and `objPpu` return arrays with color data
     * This method is the responsible for drawing the rects on the actual canvas
    */
    const bgScreenMatrix = this.bgPpu.draw()
    const objScreenMatrix = this.objPpu.draw()

    // Clear the canvas
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)


    // The background becomes white if LCDC bit 0 is not set
    const bgEnable = getBit(this.mem.LCDC, 0) === 1

    for (let y = 0; y < Sizes.SCREEN_HEIGHT; y++) {
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
  }

  public _test = () => {
    this.mem.SCX = int8(0)
    this.mem.SCY = int8(0)
    this.mem.LCDC = int8(0xeb)

    pkmnVramDump.forEach((byte, index) => {
      this.mem.store8(int8(byte), uint16(Addresses.VRAM + index))
    })
    pkmnOamDump.forEach((byte, index) => {
      this.mem.store8(int8(byte), uint16(Addresses.OAM + index))
    })

    this.draw()
  } 
}