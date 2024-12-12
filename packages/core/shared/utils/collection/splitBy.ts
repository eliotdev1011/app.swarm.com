import range from 'lodash/range'

/**
 * Splits an array/collections to multiple arrays using a splitter function
 * that is used to iterate over the elements of the array
 * and returns either:
 * - a number that represents the index of the collection the element should belong to
 * OR
 * - a boolean, when false, the element will be included in the first array, when true in the second
 *
 * @param collection - collection of elements to split
 * @param splitter - splitter function to apply to each element, returns new collection index
 * @param count - a default number of collections to create
 * @returns a collection of collections
 */
export const splitBy = <T>(
  collection: T[],
  splitter: ((element: T) => number) | ((element: T) => boolean),
  count?: number,
) => {
  const newCollections: T[][] = []

  if (count !== undefined) {
    range(0, count).forEach(() => newCollections.push([]))
  }

  collection.forEach((element) => {
    const newCollectionIndex = Number(splitter(element))

    if (newCollectionIndex > newCollections.length - 1) {
      range(newCollections.length, newCollectionIndex + 1).forEach(() =>
        newCollections.push([]),
      )
    }

    newCollections[newCollectionIndex].push(element)
  })

  return newCollections
}
