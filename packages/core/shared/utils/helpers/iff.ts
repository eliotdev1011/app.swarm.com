const iff = <T, O>(condition: boolean, then: T, otherwise: O) =>
  condition ? then : otherwise

export default iff
