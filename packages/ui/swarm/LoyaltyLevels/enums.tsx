import { RewardsColor } from '@ui/theme'

export const LOYALTY_LEVEL_DESIGN = [
  {
    id: 'standard',
    icon: 'Standard',
    color: RewardsColor.Base,
    label: 'Standard',
    boostPercents: 'Participate',
  },
  {
    id: 'silver',
    icon: 'Silver',
    color: RewardsColor.Silver,
    label: 'Silver',
    boostPercents: '+25%',
  },
  {
    id: 'gold',
    icon: 'Gold',
    color: RewardsColor.Gold,
    label: 'Gold',
    boostPercents: '+50%',
  },
  {
    id: 'platinum',
    icon: 'Platinum',
    color: RewardsColor.Platinum,
    label: 'Platinum',
    boostPercents: '+100%',
  },
]
