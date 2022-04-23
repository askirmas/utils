export {
  durate
}

function durate(now = Date.now) {
  const started = now()
  return function end() {
    return now() - started
  }
}
