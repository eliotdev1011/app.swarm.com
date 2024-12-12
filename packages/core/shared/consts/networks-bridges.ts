export type BridgeName = 'Polygon Bridge' | 'Base Bridge'

export interface IBridge {
  name: BridgeName
  url: string
}

export interface IBridges {
  polygon: IBridge
  base: IBridge
}

export const networksBridges: IBridges = {
  polygon: {
    name: 'Polygon Bridge',
    url: 'https://wallet.polygon.technology/polygon/bridge',
  },
  base: {
    name: 'Base Bridge',
    url: 'https://bridge.base.org',
  },
}
