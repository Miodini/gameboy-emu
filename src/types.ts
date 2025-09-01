export type Bit = 0 | 1
export type Int8 = number & { __brand: 'int8' }
export type Uint8 = number & { __brand: 'uint8' }
export type Int16 = number & { __brand: 'int16' }
export type Uint16 = number & { __brand: 'uint16' }
/** Bit position within one byte (0-indexed) */
export type BitPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export namespace WorkerTypes {
  export enum MessageType {
    Dump,
    Load,
    Pause
  }

  export type LoadMessagePayload = {
    romData: Uint8Array,
    canvas: OffscreenCanvas,
    pixelSize: number
  }

  export type DumpMessagePayload = {
    startAddress: number,
    endAddress: number
  }

  export type WorkerMessage =
    | { messageType: MessageType.Dump, payload: DumpMessagePayload }
    | { messageType: MessageType.Load, payload: LoadMessagePayload }
    | { messageType: MessageType.Pause }
}