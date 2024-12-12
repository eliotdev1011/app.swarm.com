import { useUserId } from '@swarm/core/state/hooks'
import { useStoredNetworkId } from '@swarm/core/web3'
import { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
/* eslint-disable-next-line import/extensions */
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import styled from 'styled-components/macro'

import AnnouncementItem from './Item'
import { Announcement } from './interfaces'
import { useAnnouncements } from './useAnnouncements'

const StyledCarousel = styled(Carousel)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.commonDialog};

  width: 100%;
  height: ${({ theme }) => theme.layout.announcements.heightPixels}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.[0]}) {
    height: ${({ theme }) => theme.layout.announcements.mobileHeightPixels}px;
  }
`

interface IAnnouncementsProps {
  announcements: Announcement[]
  closeAnnouncement: (id: string) => void
}

const Announcements = ({
  announcements,
  closeAnnouncement,
}: IAnnouncementsProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)
  const networkId = useStoredNetworkId()
  const { viewAnnouncement } = useAnnouncements(networkId)
  const userId = useUserId()

  useEffect(() => {
    if (currentSlideIndex >= announcements.length) {
      setCurrentSlideIndex(Math.max(announcements.length - 1, 0))
    }
  }, [announcements, currentSlideIndex])

  useEffect(() => {
    if (userId && announcements[currentSlideIndex]?.id) {
      viewAnnouncement(announcements[currentSlideIndex].id)
    }
  }, [viewAnnouncement, userId, currentSlideIndex, announcements])

  if (announcements.length === 0) {
    return null
  }

  return (
    <StyledCarousel
      selectedItem={currentSlideIndex}
      autoPlay
      infiniteLoop
      centerMode={false}
      showStatus={false}
      showArrows={false}
      showIndicators={false}
      showThumbs={false}
      interval={6000}
      onChange={(index) => {
        setCurrentSlideIndex(index)
      }}
    >
      {announcements.map((announcement) => {
        return (
          <AnnouncementItem
            key={announcement.id}
            label={announcement.label}
            backgroundColor={announcement.backgroundColor}
            onClose={() => {
              closeAnnouncement(announcement.id)
            }}
          />
        )
      })}
    </StyledCarousel>
  )
}

export default Announcements
