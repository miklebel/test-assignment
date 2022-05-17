const ifeq = function (...args) {
  const options = args.pop()
  const comparisonArr = args.reduce(
    (prev, curr) => {
      if (prev[prev.length - 1].length < 2) {
        const lastArr = prev[prev.length - 1]
        lastArr.push(curr)
        return prev
      } else {
        return [...prev, [curr]]
      }
    },
    [[]]
  )
  if (!comparisonArr.map(([a, b]) => a === b).includes(false)) return options.fn(this)
  else options.inverse(this)
}

export default { ifeq }
