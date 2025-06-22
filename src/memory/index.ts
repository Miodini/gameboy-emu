import type { Byte, Word } from '../types'
import { int8, int16, uint16 } from '../utils'

export default class Memory {
    // rom - 0x0000 - 0x3FFF
    // rom bank 1 - 0x4000 - 0x7FFF
    // vram = 0x9FFF - 0x8000
    // sram = 0xBFFF - 0xA000
    // wram = 0xDFFF - 0xC000
    // oam = 0xFE9F - 0xFE00
    // io = 0xFF7F - 0xFF00
    // hram = 0xFFFE - 0xFF80
    // ie = 0xFFFF
    readonly memory = new Int8Array(0xFFFF) as Int8Array & { [index: number]: Byte } 

    load8 (position: Word): Byte {
        return this.memory[position]
    }

    load16 (position: Word): Word {
        return int16((this.memory[position] << 8) | this.memory[position + 1])
    }

    store8(value: Byte, position: Word): void {
        this.memory[uint16(position)] = value
    }
    
    store16 (value: Word, position: Word): void {
        this.memory[uint16(position)] = int8((value & 0xFF00) >> 8)
        this.memory[uint16(position + 1)] = int8(value & 0x00FF)
    }

    // Memory regions

    get rom (): Int8Array {
        return this.memory.subarray(0, 0x4000)
    }

    set rom (value: Int8Array) {
        this.memory.set(value.subarray(0, 0x4000))
    }

    // Hardware registers

    get P1JOYP () {
        return this.load8(uint16(0xFF00))
    }
    set P1JOYP(value: Byte) {
        this.store8(value, uint16(0xFF00))
    }

    get SB () {
        return this.load8(uint16(0xFF01))
    }
    set SB(value: Byte) {
        this.store8(value, uint16(0xFF01))
    }

    get SC () {
        return this.load8(uint16(0xFF02))
    }
    set SC(value: Byte) {
        this.store8(value, uint16(0xFF02))
    }

    get DIV () {
        return this.load8(uint16(0xFF04))
    }
    set DIV(value: Byte) {
        this.store8(value, uint16(0xFF04))
    }

    get TIMA () {
        return this.load8(uint16(0xFF05))
    }
    set TIMA(value: Byte) {
        this.store8(value, uint16(0xFF05))
    }

    get TMA () {
        return this.load8(uint16(0xFF06))
    }
    set TMA(value: Byte) {
        this.store8(value, uint16(0xFF06))
    }

    get TAC () {
        return this.load8(uint16(0xFF07))
    }
    set TAC(value: Byte) {
        this.store8(value, uint16(0xFF07))
    }

    get IF () {
        return this.load8(uint16(0xFF0F))
    }
    set IF(value: Byte) {
        this.store8(value, uint16(0xFF0F))
    }

    get NR10 () {
        return this.load8(uint16(0xFF10))
    }
    set NR10(value: Byte) {
        this.store8(value, uint16(0xFF10))
    }

    get NR11 () {
        return this.load8(uint16(0xFF11))
    }
    set NR11(value: Byte) {
        this.store8(value, uint16(0xFF11))
    }

    get NR12 () {
        return this.load8(uint16(0xFF12))
    }
    set NR12(value: Byte) {
        this.store8(value, uint16(0xFF12))
    }

    get NR13 () {
        return this.load8(uint16(0xFF13))
    }
    set NR13(value: Byte) {
        this.store8(value, uint16(0xFF13))
    }

    get NR14 () {
        return this.load8(uint16(0xFF14))
    }
    set NR14(value: Byte) {
        this.store8(value, uint16(0xFF14))
    }

    get NR21 () {
        return this.load8(uint16(0xFF16))
    }
    set NR21(value: Byte) {
        this.store8(value, uint16(0xFF16))
    }

    get NR22 () {
        return this.load8(uint16(0xFF17))
    }
    set NR22(value: Byte) {
        this.store8(value, uint16(0xFF17))
    }

    get NR23 () {
        return this.load8(uint16(0xFF18))
    }
    set NR23(value: Byte) {
        this.store8(value, uint16(0xFF18))
    }

    get NR24 () {
        return this.load8(uint16(0xFF19))
    }
    set NR24(value: Byte) {
        this.store8(value, uint16(0xFF19))
    }

    get NR30 () {
        return this.load8(uint16(0xFF1A))
    }
    set NR30(value: Byte) {
        this.store8(value, uint16(0xFF1A))
    }

    get NR31 () {
        return this.load8(uint16(0xFF1B))
    }
    set NR31(value: Byte) {
        this.store8(value, uint16(0xFF1B))
    }

    get NR32 () {
        return this.load8(uint16(0xFF1C))
    }
    set NR32(value: Byte) {
        this.store8(value, uint16(0xFF1C))
    }

    get NR33 () {
        return this.load8(uint16(0xFF1D))
    }
    set NR33(value: Byte) {
        this.store8(value, uint16(0xFF1D))
    }

    get NR34 () {
        return this.load8(uint16(0xFF1E))
    }
    set NR34(value: Byte) {
        this.store8(value, uint16(0xFF1E))
    }

    get NR41 () {
        return this.load8(uint16(0xFF20))
    }
    set NR41(value: Byte) {
        this.store8(value, uint16(0xFF20))
    }

    get NR42 () {
        return this.load8(uint16(0xFF21))
    }
    set NR42(value: Byte) {
        this.store8(value, uint16(0xFF21))
    }

    get NR43 () {
        return this.load8(uint16(0xFF22))
    }
    set NR43(value: Byte) {
        this.store8(value, uint16(0xFF22))
    }


    get NR44 () {
        return this.load8(uint16(0xFF23))
    }
    set NR44(value: Byte) {
        this.store8(value, uint16(0xFF23))
    }

    get NR50 () {
        return this.load8(uint16(0xFF24))
    }
    set NR50(value: Byte) {
        this.store8(value, uint16(0xFF24))
    }

    get NR51 () {
        return this.load8(uint16(0xFF25))
    }
    set NR51(value: Byte) {
        this.store8(value, uint16(0xFF25))
    }

    get NR52 () {
        return this.load8(uint16(0xFF26))
    }
    set NR52(value: Byte) {
        this.store8(value, uint16(0xFF26))
    }

    get LCDC () {
        return this.load8(uint16(0xFF40))
    }
    set LCDC(value: Byte) {
        this.store8(value, uint16(0xFF40))
    }

    get STAT () {
        return this.load8(uint16(0xFF41))
    }
    set STAT(value: Byte) {
        this.store8(value, uint16(0xFF41))
    }

    get SCY () {
        return this.load8(uint16(0xFF42))
    }
    set SCY(value: Byte) {
        this.store8(value, uint16(0xFF42))
    }

    get SCX () {
        return this.load8(uint16(0xFF43))
    }
    set SCX(value: Byte) {
        this.store8(value, uint16(0xFF43))
    }

    get LY () {
        return this.load8(uint16(0xFF44))
    }
    set LY(value: Byte) {
        this.store8(value, uint16(0xFF44))
    }

    get LYC () {
        return this.load8(uint16(0xFF45))
    }
    set LYC(value: Byte) {
        this.store8(value, uint16(0xFF45))
    }

    get DMA () {
        return this.load8(uint16(0xFF46))
    }
    set DMA(value: Byte) {
        this.store8(value, uint16(0xFF46))
    }

    get BGP () {
        return this.load8(uint16(0xFF47))
    }
    set BGP(value: Byte) {
        this.store8(value, uint16(0xFF47))
    }

    get OBP0 () {
        return this.load8(uint16(0xFF48))
    }
    set OBP0(value: Byte) {
        this.store8(value, uint16(0xFF48))
    }

    get OBP1 () {
        return this.load8(uint16(0xFF49))
    }
    set OBP1(value: Byte) {
        this.store8(value, uint16(0xFF49))
    }

    get WY () {
        return this.load8(uint16(0xFF4A))
    }
    set WY(value: Byte) {
        this.store8(value, uint16(0xFF4A))
    }

    get WX () {
        return this.load8(uint16(0xFF4B))
    }
    set WX(value: Byte) {
        this.store8(value, uint16(0xFF4B))
    }

    get IE () {
        return this.load8(uint16(0xFFFF))
    }
    set IE(value: Byte) {
        this.store8(value, uint16(0xFFFF))
    }
}