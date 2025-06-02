// Starting addresses for common graphics data
export namespace Addresses {
  export const VRAM = 0x8000
  export const TILE_DATA_BLOCK_0 = 0x8000
  export const TILE_DATA_BLOCK_1 = 0x8800
  export const TILE_DATA_BLOCK_2 = 0x9000
  export const TILE_MAP_0 = 0x9800
  export const TILE_MAP_1 = 0x9C00
  export const OAM = 0xFE00
}

// Sizes for common graphics data
export namespace Sizes {
  export const TILE_DATA = 16 // Bytes
  export const TILE_MAP = 32 // Bytes
  export const TILE_PIXELS = 8 // Pixels
  export const VISIBLE_SCREEN_WIDTH = 160 // Pixels
  export const VISIBLE_SCREEN_HEIGHT = 144 // Pixels
  export const SCREEN_WIDTH = 256 // Pixels
  export const SCREEN_HEIGHT = 256 // Pixels
  export const OAM_ENTRIES = 40 // Number of OAM entries
  export const OAM_ENTRY_SIZE = 4 // Bytes per OAM entry
}