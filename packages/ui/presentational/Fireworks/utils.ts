import { ExplodingFirework } from './ExplodingFirework'
import { Firework } from './Firework'
import { FireworkDisplay } from './FireworkDisplay'

export function getHslaColor(
  hue: number,
  saturation: number,
  lightness: number,
  alpha: number,
): string {
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
}

export function getRandomIntegerInRange(
  minInclusive: number,
  maxInclusive: number,
): number {
  return (
    Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive
  )
}

export function getRandomFloat(
  minIncluside: number,
  maxExclusive: number,
): number {
  return Math.random() * (maxExclusive - minIncluside) + minIncluside
}

export function matchIsExplodedFirework(firework: Firework): boolean {
  return firework instanceof ExplodingFirework && firework.isExploded
}

export function matchIsVisuallyFinishedFireworks(
  firework: FireworkDisplay,
): boolean {
  return firework.isFinished && firework.fireworks.length === 0
}
