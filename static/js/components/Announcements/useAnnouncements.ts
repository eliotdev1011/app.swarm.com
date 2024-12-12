import useRequest from '@swarm/core/hooks/async/useRequest'
import api from '@swarm/core/services/api'
import { useUserId } from '@swarm/core/state/hooks'
import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router'

import { useAnnouncementsSessionStorage } from 'src/store/sessionStorage'

import { Announcement } from './interfaces'

type CloseAnnouncement = (announcementId: Announcement['id']) => void
type ViewAnnouncement = (announcementId: Announcement['id']) => void

interface ReturnValue {
  announcements: Announcement[]
  closeAnnouncement: CloseAnnouncement
  viewAnnouncement: ViewAnnouncement
}

export function useAnnouncements(networkId: number): ReturnValue {
  const location = useLocation()

  const userId = useUserId()

  const {
    closedAnnouncements,
    setClosedAnnouncements,
    viewedAnnouncements,
    setViewedAnnouncements,
  } = useAnnouncementsSessionStorage()

  const { data } = useRequest(
    useCallback(async () => {
      const response = await api.getAnnouncements(networkId)
      return response.map<Announcement>((announcementResponse) => {
        return {
          id: announcementResponse.id,
          text: announcementResponse.attributes.text,
          label: announcementResponse.attributes.label,
          backgroundColor: announcementResponse.attributes.background_color,
          pages: announcementResponse.attributes.pages,
        }
      })
    }, [networkId]),
  )

  const announcements = useMemo(() => {
    if (data === null) {
      return []
    }

    const result = data.filter((announcement) => {
      const isClosed = closedAnnouncements.includes(announcement.id)
      if (isClosed) {
        return false
      }

      const isAnnouncementForAllPages = announcement.pages.length === 0
      if (isAnnouncementForAllPages) {
        return true
      }

      const isForCurrentPage = location.pathname.includes(announcement.pages)
      return isForCurrentPage
    })
    return result
  }, [data, location, closedAnnouncements])

  const closeAnnouncement = useCallback<CloseAnnouncement>(
    async (announcementId) => {
      if (userId) {
        await api.addLog(userId, {
          type: 'announcement_closed',
          attributes: {
            announcementId,
          },
        })
      }

      setClosedAnnouncements((currentClosedAnnouncement) => [
        ...currentClosedAnnouncement,
        announcementId,
      ])
    },
    [setClosedAnnouncements, userId],
  )

  const viewAnnouncement = useCallback<ViewAnnouncement>(
    async (announcementId) => {
      if (userId && !viewedAnnouncements.includes(announcementId)) {
        const announcementViewedLog = await api.addLog(userId, {
          type: 'announcement_viewed',
          attributes: {
            announcementId,
          },
        })

        if (announcementViewedLog.id) {
          setViewedAnnouncements((currentViewedAnnouncement) => [
            ...currentViewedAnnouncement,
            announcementId,
          ])
        }
      }
    },
    [userId, viewedAnnouncements, setViewedAnnouncements],
  )

  const value = useMemo<ReturnValue>(() => {
    return {
      announcements,
      closeAnnouncement,
      viewAnnouncement,
    }
  }, [announcements, closeAnnouncement, viewAnnouncement])

  return value
}
