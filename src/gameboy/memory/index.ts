import type { IMemory } from './types'
import type { Uint8, Uint16 } from '../../types'
import { uint8, uint16 } from '../../utils'

const FORCE_VBLANK = false

export default class Memory implements IMemory {
    // rom - 0x0000 - 0x3FFF
    // rom bank 1 - 0x4000 - 0x7FFF
    // vram = 0x9FFF - 0x8000
    // sram = 0xBFFF - 0xA000
    // wram = 0xDFFF - 0xC000
    // oam = 0xFE9F - 0xFE00
    // io = 0xFF7F - 0xFF00
    // hram = 0xFFFE - 0xFF80
    // ie = 0xFFFF
    public readonly memory = new Uint8Array(0xFFFF)

    constructor () {
        if (FORCE_VBLANK) {
            this.LY = uint8(0x94)
        }
    }

    load8 (position: Uint16): Uint8 {
        return uint8(this.memory[position])
    }

    load16 (position: Uint16): Uint16 {
        return uint16((this.memory[position] << 8) | this.memory[uint16(position + 1)])
    }

    store8(value: Uint8, position: Uint16): void {
        this.memory[position] = value
    }
    
    store16 (value: Uint16, position: Uint16): void {
        this.memory[position] = uint8((value & 0xFF00) >> 8)
        this.memory[uint16(position + 1)] = uint8(value & 0x00FF)
    }

    // Memory regions

    get rom (): Uint8Array {
        return this.memory.subarray(0, 0x8000)
    }

    set rom (value: Uint8Array) {
        this.memory.set(value.subarray(0, 0x8000))
    }

    // Hardware registers

    get P1JOYP () {
        return this.load8(uint16(0xFF00))
    }
    set P1JOYP(value: Uint8) {
        this.store8(value, uint16(0xFF00))
    }

    get SB () {
        return this.load8(uint16(0xFF01))
    }
    set SB(value: Uint8) {
        this.store8(value, uint16(0xFF01))
    }

    get SC () {
        return this.load8(uint16(0xFF02))
    }
    set SC(value: Uint8) {
        this.store8(value, uint16(0xFF02))
    }

    get DIV () {
        return this.load8(uint16(0xFF04))
    }
    set DIV(value: Uint8) {
        this.store8(value, uint16(0xFF04))
    }

    get TIMA () {
        return this.load8(uint16(0xFF05))
    }
    set TIMA(value: Uint8) {
        this.store8(value, uint16(0xFF05))
    }

    get TMA () {
        return this.load8(uint16(0xFF06))
    }
    set TMA(value: Uint8) {
        this.store8(value, uint16(0xFF06))
    }

    get TAC () {
        return this.load8(uint16(0xFF07))
    }
    set TAC(value: Uint8) {
        this.store8(value, uint16(0xFF07))
    }

    get IF () {
        return this.load8(uint16(0xFF0F))
    }
    set IF(value: Uint8) {
        this.store8(value, uint16(0xFF0F))
    }

    get NR10 () {
        return this.load8(uint16(0xFF10))
    }
    set NR10(value: Uint8) {
        this.store8(value, uint16(0xFF10))
    }

    get NR11 () {
        return this.load8(uint16(0xFF11))
    }
    set NR11(value: Uint8) {
        this.store8(value, uint16(0xFF11))
    }

    get NR12 () {
        return this.load8(uint16(0xFF12))
    }
    set NR12(value: Uint8) {
        this.store8(value, uint16(0xFF12))
    }

    get NR13 () {
        return this.load8(uint16(0xFF13))
    }
    set NR13(value: Uint8) {
        this.store8(value, uint16(0xFF13))
    }

    get NR14 () {
        return this.load8(uint16(0xFF14))
    }
    set NR14(value: Uint8) {
        this.store8(value, uint16(0xFF14))
    }

    get NR21 () {
        return this.load8(uint16(0xFF16))
    }
    set NR21(value: Uint8) {
        this.store8(value, uint16(0xFF16))
    }

    get NR22 () {
        return this.load8(uint16(0xFF17))
    }
    set NR22(value: Uint8) {
        this.store8(value, uint16(0xFF17))
    }

    get NR23 () {
        return this.load8(uint16(0xFF18))
    }
    set NR23(value: Uint8) {
        this.store8(value, uint16(0xFF18))
    }

    get NR24 () {
        return this.load8(uint16(0xFF19))
    }
    set NR24(value: Uint8) {
        this.store8(value, uint16(0xFF19))
    }

    get NR30 () {
        return this.load8(uint16(0xFF1A))
    }
    set NR30(value: Uint8) {
        this.store8(value, uint16(0xFF1A))
    }

    get NR31 () {
        return this.load8(uint16(0xFF1B))
    }
    set NR31(value: Uint8) {
        this.store8(value, uint16(0xFF1B))
    }

    get NR32 () {
        return this.load8(uint16(0xFF1C))
    }
    set NR32(value: Uint8) {
        this.store8(value, uint16(0xFF1C))
    }

    get NR33 () {
        return this.load8(uint16(0xFF1D))
    }
    set NR33(value: Uint8) {
        this.store8(value, uint16(0xFF1D))
    }

    get NR34 () {
        return this.load8(uint16(0xFF1E))
    }
    set NR34(value: Uint8) {
        this.store8(value, uint16(0xFF1E))
    }

    get NR41 () {
        return this.load8(uint16(0xFF20))
    }
    set NR41(value: Uint8) {
        this.store8(value, uint16(0xFF20))
    }

    get NR42 () {
        return this.load8(uint16(0xFF21))
    }
    set NR42(value: Uint8) {
        this.store8(value, uint16(0xFF21))
    }

    get NR43 () {
        return this.load8(uint16(0xFF22))
    }
    set NR43(value: Uint8) {
        this.store8(value, uint16(0xFF22))
    }


    get NR44 () {
        return this.load8(uint16(0xFF23))
    }
    set NR44(value: Uint8) {
        this.store8(value, uint16(0xFF23))
    }

    get NR50 () {
        return this.load8(uint16(0xFF24))
    }
    set NR50(value: Uint8) {
        this.store8(value, uint16(0xFF24))
    }

    get NR51 () {
        return this.load8(uint16(0xFF25))
    }
    set NR51(value: Uint8) {
        this.store8(value, uint16(0xFF25))
    }

    get NR52 () {
        return this.load8(uint16(0xFF26))
    }
    set NR52(value: Uint8) {
        this.store8(value, uint16(0xFF26))
    }

    get LCDC () {
        return this.load8(uint16(0xFF40))
    }
    set LCDC(value: Uint8) {
        this.store8(value, uint16(0xFF40))
    }

    get STAT () {
        return this.load8(uint16(0xFF41))
    }
    set STAT(value: Uint8) {
        this.store8(value, uint16(0xFF41))
    }

    get SCY () {
        return this.load8(uint16(0xFF42))
    }
    set SCY(value: Uint8) {
        this.store8(value, uint16(0xFF42))
    }

    get SCX () {
        return this.load8(uint16(0xFF43))
    }
    set SCX(value: Uint8) {
        this.store8(value, uint16(0xFF43))
    }

    get LY () {
        return FORCE_VBLANK ? uint8(0x91) : this.load8(uint16(0xFF44))
    }
    set LY(value: Uint8) {
        this.store8(FORCE_VBLANK ? uint8(0x91) : value, uint16(0xFF44))
    }

    get LYC () {
        return this.load8(uint16(0xFF45))
    }
    set LYC(value: Uint8) {
        this.store8(value, uint16(0xFF45))
    }

    get DMA () {
        return this.load8(uint16(0xFF46))
    }
    set DMA(value: Uint8) {
        this.store8(value, uint16(0xFF46))
    }

    get BGP () {
        return this.load8(uint16(0xFF47))
    }
    set BGP(value: Uint8) {
        this.store8(value, uint16(0xFF47))
    }

    get OBP0 () {
        return this.load8(uint16(0xFF48))
    }
    set OBP0(value: Uint8) {
        this.store8(value, uint16(0xFF48))
    }

    get OBP1 () {
        return this.load8(uint16(0xFF49))
    }
    set OBP1(value: Uint8) {
        this.store8(value, uint16(0xFF49))
    }

    get WY () {
        return this.load8(uint16(0xFF4A))
    }
    set WY(value: Uint8) {
        this.store8(value, uint16(0xFF4A))
    }

    get WX () {
        return this.load8(uint16(0xFF4B))
    }
    set WX(value: Uint8) {
        this.store8(value, uint16(0xFF4B))
    }

    get IE () {
        return this.load8(uint16(0xFFFF))
    }
    set IE(value: Uint8) {
        this.store8(value, uint16(0xFFFF))
    }
}