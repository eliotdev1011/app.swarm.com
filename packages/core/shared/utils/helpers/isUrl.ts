export function isUrl(str: string) {
  return str.startsWith('https:') || str.startsWith('ipfs:')
}
