// Pulled from react-compat
// https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
function shallowDiffers (a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}

export default (instance, nextProps, nextState) => {
  return (
    shallowDiffers(instance.props, nextProps) ||
    shallowDiffers(instance.state, nextState)
  )
}
