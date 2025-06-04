import Memory from "../memory"
import BgPpu from "./bgPpu"
import ObjectPpu from "./objectPpu"
import { Addresses, Sizes } from "./constants"
import { pkmnVramDump, pkmnOamDump } from '../../mock/mocks'
import { int8, uint16 } from "../utils"

export default class Ppu {
  private readonly mem: Memory
  private readonly bgPpu: BgPpu
  private readonly objPpu: ObjectPpu
  readonly pixelSize = 5

  constructor (memoryInstance: Memory) {
    const canvas = document.createElement('canvas')
    
    canvas.width = Sizes.VISIBLE_SCREEN_WIDTH * this.pixelSize
    canvas.height = Sizes.VISIBLE_SCREEN_HEIGHT * this.pixelSize
    document.getElementById('screen')?.appendChild(canvas)

    this.mem = memoryInstance
    this.bgPpu = new BgPpu(memoryInstance, canvas, this.pixelSize)
    this.objPpu = new ObjectPpu(memoryInstance, canvas, this.pixelSize)
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

    this.bgPpu.draw()
    this.objPpu.draw()
  } 
}