export const directionToNumber = (orderDirection: 'asc' | 'desc' = 'asc') =>
  orderDirection === 'desc' ? -1 : 1
