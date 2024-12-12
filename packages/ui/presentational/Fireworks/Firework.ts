/* eslint-disable no-param-reassign -- Required for interacting with CanvasRenderingContext2D */

import { getHslaColor } from './utils'

export interface FireworkOptions {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hsl: number[]
}

export class Firework {
  x = 0

  y = 0

  vx = 0

  vy = 0

  alpha = 1

  size: number

  hsl: number[]

  constructor(options: FireworkOptions) {
    const { x, y, vx, vy, size, hsl } = options

    this.setPosition(x, y)
    this.setVelocity(vx, vy)

    this.size = size
    this.hsl = hsl
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setVelocity(vx: number, vy: number) {
    this.vx = vx
    this.vy = vy
  }

  render(canvasContext: CanvasRenderingContext2D) {
    canvasContext.fillStyle = getHslaColor(
      this.hsl[0],
      this.hsl[1],
      this.hsl[2],
      this.alpha,
    )
    canvasContext.beginPath()
    canvasContext.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    canvasContext.fill()
  }
}
