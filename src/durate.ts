import { performance } from "perf_hooks"
import type { Dict } from "./ts-swiss.types"

type DurationStat = number & {
  /** Started */
  "s": number
  /** Current for pause */
  "c": number
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
, {defineProperty: $defineProperty} = Object
, descriptor = {
  value,
  "enumerable": false
}

export type {
  DurationStat
}
export {
  durate,
  start,
  stop,
  pause
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
  entry === undefined && (entry = store[label] = $defineProperty({
    "c": 0,
    "s": NaN,
    "n": 0,
    "t": 0,
    "m": Infinity,
    "M": 0
  }, Symbol.toPrimitive, descriptor))

  entry.s = now()
}

function pause<S extends Dict<DurationStat>>(store: S, label: keyof S) {
  let end = now()
  let end2 = now()
  , entry = store[label]
  , d = end - entry.s + (end2 > end ? end - end2 : 0)

  entry.s = NaN
  entry.t += d

  return entry.c += d
}

function stop<S extends Dict<DurationStat>>(store: S, label: keyof S) {
  let c = pause(store, label)
  let entry = store[label]

  entry.c = 0
  entry.n++

  c < entry.m && (entry.m = c)
  c > entry.M && (entry.M = c)
}

function value(this: DurationStat) {
  return this.t / this.n
}
