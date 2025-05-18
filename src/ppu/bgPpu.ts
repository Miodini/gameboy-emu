import Ppu from './index'
import { pkmnVramDump } from '../../mock/mocks'
import { getBit, int8, uint16 } from '../utils'

export default class BgPpu extends Ppu {
  /** @override */
  protected draw () {
    if (getBit(this.mem.LCDC, 0) === 0) {
      return
    }

    const selectedTileMap = getBit(this.mem.LCDC, 3) === 0 ? 0 : 1
    const selectedTileData = getBit(this.mem.LCDC, 4) === 0 ? 1 : 0
    super.draw(selectedTileData, selectedTileMap)
  }

  public _test = () => {
    this.mem.SCX = int8(0)
    this.mem.SCY = int8(16)
    this.mem.LCDC = int8(1)
    pkmnVramDump.forEach((byte, index) => {
      this.mem.store8(int8(byte), uint16(0x8000 + index))
    })
    this.draw()
  } 
}