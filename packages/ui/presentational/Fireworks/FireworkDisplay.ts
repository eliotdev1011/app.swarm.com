import { ExplodingFirework } from './ExplodingFirework'
import { FadingFirework } from './FadingFirework'
import {
  matchIsExplodedFirework,
  matchIsVisuallyFinishedFireworks,
} from './utils'

export class FireworkDisplay {
  fireworks: (FadingFirework | ExplodingFirework)[]

  limit: number

  isFinished = false

  finishedCallback = () => {}

  constructor(limit = 5) {
    this.fireworks = []
    this.limit = limit
  }

  add(firework: FadingFirework | ExplodingFirework) {
    this.fireworks.push(firework)
  }

  remove(firework: FadingFirework | ExplodingFirework) {
    this.fireworks = this.fireworks.filter((someFirework) => {
      return someFirework !== firework
    })
  }

  render(canvasContext: CanvasRenderingContext2D) {
    this.fireworks.forEach((firework) => {
      firework.render(canvasContext)
    })
  }

  update(gravity: number) {
    this.fireworks.forEach((firework) => {
      firework.update(gravity)

      if (firework.alpha <= 0 || matchIsExplodedFirework(firework)) {
        this.remove(firework)
      }
    })

    if (matchIsVisuallyFinishedFireworks(this)) {
      this.finishedCallback()
    }
  }

  finish(callback?: () => void) {
    this.isFinished = true

    if (callback !== undefined) {
      this.finishedCallback = callback
    }
  }
}
