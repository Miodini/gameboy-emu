import { Colors } from "./constants"

export interface IBgPpu {
  draw (): (Colors | null)[][]
}

export interface IObjectPpu {
  draw (): (Colors | null)[][]
}

export interface IPpu {
  get canvasCtx (): OffscreenCanvasRenderingContext2D
  draw (): void
}