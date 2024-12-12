import { Firework, FireworkOptions } from './Firework'
import { explode } from './fireworks'
import { getRandomIntegerInRange } from './utils'

interface ExplodingFireworkOptions extends FireworkOptions {
  canvasHeight: number
}

export class ExplodingFirework extends Firework {
  canvasHeight: number

  isExploded: boolean

  explodePoint: number

  constructor(options: ExplodingFireworkOptions) {
    super(options)

    this.canvasHeight = options.canvasHeight
    this.isExploded = false
    this.explodePoint = getRandomIntegerInRange(
      options.canvasHeight / 10,
      options.canvasHeight / 1.5,
    )
  }

  update(gravity: number) {
    this.x += this.vx
    this.y += this.vy

    if (this.y < this.canvasHeight / 1.5) {
      this.vy += gravity
    }

    if (!this.isExploded) {
      if (this.vy >= 0 || this.y < this.explodePoint) {
        explode(this)

        this.alpha = 0
        this.isExploded = true
      }
    }
  }
}
