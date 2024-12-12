import { Firework } from './Firework'

export class FadingFirework extends Firework {
  update(gravity: number) {
    this.x += this.vx
    this.y += this.vy

    this.vy += gravity

    if (this.alpha > 0) {
      this.alpha -= 0.03
    }
  }
}
