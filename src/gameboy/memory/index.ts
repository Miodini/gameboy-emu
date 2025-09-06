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
    public readonly memory = new Uint8Array(0xFFFF + 1)

    constructor () {
        if (FORCE_VBLANK) {
            this.LY = uint8(0x94)
        }
    }

    load8 (position: Uint16): Uint8 {
        return this.memory[position] as Uint8
    }

    load16 (position: Uint16): Uint16 {
        return uint16((this.memory[position] << 8) | this.memory[uint16(position + 1)])
    }

    store8 (value: number, position: Uint16): void {
        this.memory[position] = value
    }
    
    store16 (value: number, position: Uint16): void {
        this.memory[position] = uint8((uint16(value) & 0xFF00) >> 8)
        this.memory[uint16(position + 1)] = uint8(uint16(value) & 0x00FF)
    }

    // Memory regions

    get rom (): Uint8Array {
        return this.memory.subarray(0, 0x8000)
    }

    set rom (value: Uint8Array) {
        this.memory.set(value.subarray(0, 0x8000))
    }

    // Hardware registers
    get P1JOYP (): Uint8 {
        return this.load8(uint16(0xFF00))
    }
    set P1JOYP (value: number) {
        this.store8(value, uint16(0xFF00))
    }

    get SB (): Uint8 {
        return this.load8(uint16(0xFF01))
    }
    set SB (value: number) {
        this.store8(value, uint16(0xFF01))
    }

    get SC (): Uint8 {
        return this.load8(uint16(0xFF02))
    }
    set SC (value: number) {
        this.store8(value, uint16(0xFF02))
    }

    get DIV (): Uint8 {
        return this.load8(uint16(0xFF04))
    }
    set DIV (value: number) {
        this.store8(value, uint16(0xFF04))
    }

    get TIMA (): Uint8 {
        return this.load8(uint16(0xFF05))
    }
    set TIMA (value: number) {
        this.store8(value, uint16(0xFF05))
    }

    get TMA (): Uint8 {
        return this.load8(uint16(0xFF06))
    }
    set TMA (value: number) {
        this.store8(value, uint16(0xFF06))
    }

    get TAC (): Uint8{
        return this.load8(uint16(0xFF07))
    }
    set TAC (value: number) {
        this.store8(value, uint16(0xFF07))
    }

    get IF (): Uint8 {
        return this.load8(uint16(0xFF0F))
    }
    set IF (value: number) {
        this.store8(value, uint16(0xFF0F))
    }

    get NR10 (): Uint8 {
        return this.load8(uint16(0xFF10))
    }
    set NR10 (value: number) {
        this.store8(value, uint16(0xFF10))
    }

    get NR11 (): Uint8 {
        return this.load8(uint16(0xFF11))
    }
    set NR11 (value: number) {
        this.store8(value, uint16(0xFF11))
    }

    get NR12 (): Uint8 {
        return this.load8(uint16(0xFF12))
    }
    set NR12 (value: number) {
        this.store8(value, uint16(0xFF12))
    }

    get NR13 (): Uint8 {
        return this.load8(uint16(0xFF13))
    }
    set NR13 (value: number) {
        this.store8(value, uint16(0xFF13))
    }

    get NR14 (): Uint8 {
        return this.load8(uint16(0xFF14))
    }
    set NR14 (value: number) {
        this.store8(value, uint16(0xFF14))
    }

    get NR21 (): Uint8 {
        return this.load8(uint16(0xFF16))
    }
    set NR21 (value: number) {
        this.store8(value, uint16(0xFF16))
    }

    get NR22 (): Uint8 {
        return this.load8(uint16(0xFF17))
    }
    set NR22 (value: number) {
        this.store8(value, uint16(0xFF17))
    }

    get NR23 (): Uint8 {
        return this.load8(uint16(0xFF18))
    }
    set NR23 (value: number) {
        this.store8(value, uint16(0xFF18))
    }

    get NR24 (): Uint8 {
        return this.load8(uint16(0xFF19))
    }
    set NR24 (value: number) {
        this.store8(value, uint16(0xFF19))
    }

    get NR30 (): Uint8 {
        return this.load8(uint16(0xFF1A))
    }
    set NR30 (value: number) {
        this.store8(value, uint16(0xFF1A))
    }

    get NR31 (): Uint8 {
        return this.load8(uint16(0xFF1B))
    }
    set NR31 (value: number) {
        this.store8(value, uint16(0xFF1B))
    }

    get NR32 (): Uint8 {
        return this.load8(uint16(0xFF1C))
    }
    set NR32 (value: number) {
        this.store8(value, uint16(0xFF1C))
    }

    get NR33 (): Uint8 {
        return this.load8(uint16(0xFF1D))
    }
    set NR33 (value: number) {
        this.store8(value, uint16(0xFF1D))
    }

    get NR34 (): Uint8 {
        return this.load8(uint16(0xFF1E))
    }
    set NR34 (value: number) {
        this.store8(value, uint16(0xFF1E))
    }

    get NR41 (): Uint8 {
        return this.load8(uint16(0xFF20))
    }
    set NR41 (value: number) {
        this.store8(value, uint16(0xFF20))
    }

    get NR42 (): Uint8 {
        return this.load8(uint16(0xFF21))
    }
    set NR42 (value: number) {
        this.store8(value, uint16(0xFF21))
    }

    get NR43 (): Uint8 {
        return this.load8(uint16(0xFF22))
    }
    set NR43 (value: number) {
        this.store8(value, uint16(0xFF22))
    }


    get NR44 (): Uint8 {
        return this.load8(uint16(0xFF23))
    }
    set NR44 (value: number) {
        this.store8(value, uint16(0xFF23))
    }

    get NR50 (): Uint8 {
        return this.load8(uint16(0xFF24))
    }
    set NR50 (value: number) {
        this.store8(value, uint16(0xFF24))
    }

    get NR51 (): Uint8 {
        return this.load8(uint16(0xFF25))
    }
    set NR51 (value: number) {
        this.store8(value, uint16(0xFF25))
    }

    get NR52 (): Uint8 {
        return this.load8(uint16(0xFF26))
    }
    set NR52 (value: number) {
        this.store8(value, uint16(0xFF26))
    }

    get LCDC (): Uint8 {
        return this.load8(uint16(0xFF40))
    }
    set LCDC (value: number) {
        this.store8(value, uint16(0xFF40))
    }

    get STAT (): Uint8 {
        return this.load8(uint16(0xFF41))
    }
    set STAT (value: number) {
        this.store8(value, uint16(0xFF41))
    }

    get SCY (): Uint8{
        return this.load8(uint16(0xFF42))
    }
    set SCY (value: number) {
        this.store8(value, uint16(0xFF42))
    }

    get SCX (): Uint8 {
        return this.load8(uint16(0xFF43))
    }
    set SCX (value: number) {
        this.store8(value, uint16(0xFF43))
    }

    get LY (): Uint8 {
        return FORCE_VBLANK ? uint8(0x91) : this.load8(uint16(0xFF44))
    }
    set LY (value: number) {
        this.store8(FORCE_VBLANK ? uint8(0x91) : value, uint16(0xFF44))
    }

    get LYC (): Uint8 {
        return this.load8(uint16(0xFF45))
    }
    set LYC (value: number) {
        this.store8(value, uint16(0xFF45))
    }

    get DMA (): Uint8 {
        return this.load8(uint16(0xFF46))
    }
    set DMA (value: number) {
        this.store8(value, uint16(0xFF46))
    }

    get BGP (): Uint8 {
        return this.load8(uint16(0xFF47))
    }
    set BGP (value: number) {
        this.store8(value, uint16(0xFF47))
    }

    get OBP0 (): Uint8 {
        return this.load8(uint16(0xFF48))
    }
    set OBP0 (value: number) {
        this.store8(value, uint16(0xFF48))
    }

    get OBP1 (): Uint8 {
        return this.load8(uint16(0xFF49))
    }
    set OBP1 (value: number) {
        this.store8(value, uint16(0xFF49))
    }

    get WY (): Uint8 {
        return this.load8(uint16(0xFF4A))
    }
    set WY (value: number) {
        this.store8(value, uint16(0xFF4A))
    }

    get WX (): Uint8 {
        return this.load8(uint16(0xFF4B))
    }
    set WX (value: number) {
        this.store8(value, uint16(0xFF4B))
    }

    get IE (): Uint8 {
        return this.load8(uint16(0xFFFF))
    }
    set IE (value: number) {
        this.store8(value, uint16(0xFFFF))
    }
}