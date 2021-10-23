import type { SubKeys } from "./ts-swiss.types"

export {
  pick
}

function pick<S, P extends Array<keyof S>>(
  source: S, picking: P
): Pick<S, P[number]>
function pick<S, P extends Array<SubKeys<S, T>>, T>(
  source: S, picking: P, target: T
): Omit<T, P[number]> & Pick<S, P[number]>
function pick(source: unknown, picking: unknown[], target = {}) {
  const {length} = picking

  for (let i = 0; i < length; i++) {
    const key = picking[i]
    // CONSIDER `key in source`
    //@ts-expect-error
    target[key] = source[key]
  }
  
  return target
}