import config from '@core/config'

const {
  resources: { cdnUrl },
} = config

export const getFileUrl = (name: string) => `${cdnUrl}${name}`

export const getSvgUrl = (name: string) => getFileUrl(`${name}.svg`)
export const getPngUrl = (name: string) => getFileUrl(`${name}.png`)
