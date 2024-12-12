/* eslint-disable no-param-reassign -- Required for interacting with CanvasRenderingContext2D */

// Inspired by https://briandgls.github.io/2017/canvas-fireworks-using-js/

import { ExplodingFirework } from './ExplodingFirework'
import { FadingFirework } from './FadingFirework'
import { Firework } from './Firework'
import { FireworkDisplay } from './FireworkDisplay'
import {
  getRandomFloat,
  getRandomIntegerInRange,
  matchIsExplodedFirework,
  matchIsVisuallyFinishedFireworks,
} from './utils'

const ACTIVE_FIREWORKS_LIMIT = 20
const GRAVITY = 0.04
const HORIZONTAL_SAFE_SPACE_FACTOR = 0.1
const HORIZONTAL_SPEED_FACTOR = 1.5
const VERTICAL_SPEED_FACTOR = 2
const TRAIL_SIZE_FACTOR = 1

let STAGE = new FireworkDisplay(ACTIVE_FIREWORKS_LIMIT)
let REQUEST_ANIMATION_FRAME_ID = -1

function cleanFrame(
  canvasContext: CanvasRenderingContext2D,
  opacity: number,
  width: number,
  height: number,
): void {
  canvasContext.globalCompositeOperation = 'destination-out'
  canvasContext.fillStyle = `rgba(128, 192, 254, ${opacity})`
  canvasContext.fillRect(0, 0, width, height)
  canvasContext.globalCompositeOperation = 'lighter'
}

export function explode(firework: Firework) {
  const embers = 10
  const radius = getRandomIntegerInRange(3, 5)

  for (let i = 0; i < embers; i += 1) {
    const ember = new FadingFirework({
      x: firework.x,
      y: firework.y,
      vx: radius * Math.cos((2 * Math.PI * i) / embers),
      vy: radius * Math.sin((2 * Math.PI * i) / embers),
      size: firework.size + 1,
      hsl: firework.hsl,
    })

    STAGE.add(ember)
  }
}

function igniteNewFirework(width: number, height: number) {
  const horizontalSafeSpace = width * HORIZONTAL_SAFE_SPACE_FACTOR

  const firework = new ExplodingFirework({
    x: getRandomIntegerInRange(
      horizontalSafeSpace,
      width - horizontalSafeSpace,
    ),
    y: height,
    vx: getRandomFloat(-1, 1) * HORIZONTAL_SPEED_FACTOR,
    vy: getRandomFloat(2, 4) * -1 * VERTICAL_SPEED_FACTOR,
    size: getRandomIntegerInRange(1, 2),
    // Values defined based on generator at https://mdigi.tools/color-shades/#0078EF
    hsl: [
      210,
      getRandomIntegerInRange(98, 99),
      getRandomIntegerInRange(55, 100),
    ],
    canvasHeight: height,
  })

  STAGE.add(firework)
}

function draw(
  canvasContext: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  if (matchIsVisuallyFinishedFireworks(STAGE)) {
    window.cancelAnimationFrame(REQUEST_ANIMATION_FRAME_ID)
    return
  }

  REQUEST_ANIMATION_FRAME_ID = window.requestAnimationFrame(() => {
    draw(canvasContext, width, height)
  })
  cleanFrame(canvasContext, 0.13 * TRAIL_SIZE_FACTOR, width, height)

  const nonExplodedFireworks = STAGE.fireworks.filter((firework) => {
    return !matchIsExplodedFirework(firework)
  })

  if (nonExplodedFireworks.length < STAGE.limit && STAGE.isFinished === false) {
    igniteNewFirework(width, height)
  }

  STAGE.update(GRAVITY)
  STAGE.render(canvasContext)
}

export function setupFireworks(
  containerElement: HTMLElement,
  canvasElement: HTMLCanvasElement,
): FireworkDisplay | null {
  const context = canvasElement.getContext('2d')

  if (context === null) {
    return null
  }

  // First, handle pixel ratio for retina displays
  const baseWidth = containerElement.clientWidth
  const baseHeight = containerElement.clientHeight

  const pixelRatio = window.devicePixelRatio || 1

  canvasElement.width = baseWidth * pixelRatio
  canvasElement.height = baseHeight * pixelRatio
  canvasElement.style.width = `${baseWidth}px`
  canvasElement.style.height = `${baseHeight}px`

  context.scale(pixelRatio, pixelRatio)

  // Second, initialize a blank canvas
  context.fillStyle = 'transparent'
  context.fillRect(0, 0, baseWidth, baseHeight)

  // Third, setup the fireworks
  STAGE = new FireworkDisplay(ACTIVE_FIREWORKS_LIMIT)

  // Finally, start drawing
  draw(context, baseWidth, baseHeight)

  return STAGE
}
