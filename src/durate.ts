import { performance } from "perf_hooks"

const {now} = performance

export {
  durate
}

function durate(n = now) {
  const started = n()
  return function end() {
    return n() - started
  }
}
