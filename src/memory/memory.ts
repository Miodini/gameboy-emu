import type { Byte, Word } from '../types.js'
import { int8, int16, uint16 } from '../utils.js'

export default class Memory {
    readonly rom = {
        start: 0x0000,
        end: 0x9FFF
    }
    // vram = new Int8Array(0x9FFF - 0x8000 + 1)
    // sram = new Int8Array(0xBFFF - 0xA000 + 1)
    // wram = new Int8Array(0xDFFF - 0xC000 + 1)
    // oam = new Int8Array(0xFE9F - 0xFE00 + 1)
    // io = new Int8Array(0xFF7F - 0xFF00 + 1)
    // hram = new Int8Array(0xFFFE - 0xFF80 + 1)
    // ie = new Int8Array(0xFFFF - 0xFFFF + 1)
    /** Temporarily using a larger RAM. Needs to implement ROM banking */
    readonly ram = new Int8Array(1024*1024) as Int8Array & { [index: number]: Byte } 

    load8 (position: Word): Byte {
        return this.ram[position]
    }

    load16 (position: Word): Word {
        return int16((this.ram[position] << 8) | this.ram[position + 1])
    }

    store8(value: Byte, position: Word): void {
        this.ram[uint16(position)] = value
    }
    
    store16 (value: Word, position: Word): void {
        this.ram[uint16(position)] = int8((value & 0xFF00) >> 8)
        this.ram[uint16(position + 1)] = int8(value & 0x00FF)
    }
}