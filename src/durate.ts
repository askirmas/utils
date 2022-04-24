import { performance } from "perf_hooks"
import type { Dict } from "./ts-swiss.types"

type DurationStat = {
  /** Started */
  "s": number
  /** Count */
  "n": number
  /** Total */
  "t": number
  /**  Min */
  "m": number
  /** Max */
  "M": number
}

const {now} = performance

export type {
  DurationStat
}
export {
  durate,
  start,
  stop
}

function durate(n = now) {
  const started = n()
  return function end() {
    return n() - started
  }
}

function start<S extends Dict<DurationStat>>(store: S, label: keyof S) {
  let entry = store[label]
  //@ts-expect-error
  entry === undefined && (entry = store[label] = {
    "s": NaN,
    "n": 0,
    "t": 0,
    "m": Infinity,
    "M": 0
  })

  entry.s = now()
}

function stop<S extends Dict<DurationStat>>(store: S, label: keyof S) {
  const end = now()
  , entry = store[label]
  , d = end - entry.s

  entry.s = NaN
  entry.n++
  entry.t += d

  d < entry.m && (entry.m = d)
  d > entry.M && (entry.M = d)
}