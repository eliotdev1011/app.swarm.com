import { weekReleaseRewards } from '@core/shared/consts/week-release-rewards'

const startYear = 2021

export const getAmountReleaseThisWeek = () => {
  const currentDate = new Date()
  const oneOfAugust = new Date(currentDate.getFullYear(), 7, 1)

  const numberOfDays = Math.floor(
    (currentDate.getTime() - oneOfAugust.getTime()) / (24 * 60 * 60 * 1000),
  )

  const rewardYear = currentDate.getFullYear() - startYear
  const result = Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7) - 1

  return weekReleaseRewards[rewardYear].rewards[result]
}
