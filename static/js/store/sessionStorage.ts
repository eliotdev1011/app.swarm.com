import { useWindowStorage } from '@swarm/core/hooks/useWindowStorage'
import {
  jsonDecoder,
  jsonEncoder,
} from '@swarm/core/services/window-storage/local-storage'
import { SessionStorageService } from '@swarm/core/services/window-storage/session-storage'

export const closedAnnouncementsSessionStorage = new SessionStorageService<
  string[]
>('closed-announcements', jsonEncoder(), jsonDecoder([]))
export const viewedAnnouncementsSessionStorage = new SessionStorageService<
  string[]
>('viewed-announcements', jsonEncoder(), jsonDecoder([]))

export const useAnnouncementsSessionStorage = () => {
  const { value: closedAnnouncements, setValue: setClosedAnnouncements } =
    useWindowStorage<string[]>(closedAnnouncementsSessionStorage)
  const { value: viewedAnnouncements, setValue: setViewedAnnouncements } =
    useWindowStorage<string[]>(viewedAnnouncementsSessionStorage)

  return {
    closedAnnouncements,
    setClosedAnnouncements,
    viewedAnnouncements,
    setViewedAnnouncements,
  }
}
