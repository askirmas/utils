import type {
  Dict,
  SubKeys
} from "./ts-swiss.types"

const {isArray} = Array

export {
  pick,
  project
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

function project<S, M extends Dict<keyof S|0|1|false|true|null|undefined>
>(base: S, map: M) {
  const target = base as unknown as {
    [k in Exclude<keyof M, {[m in keyof M]:
      M[m] extends 0|false|null|undefined ? m : never
    }[keyof M]>
    ]: S[M[k] extends keyof S ? M[k] : Extract<k, keyof S>]
  }
  , toKeep = new Set<keyof S>()
  , renames = {} as Record<keyof S, string | string[]>
  
  for (const key in map) {
    const proj = map[key as keyof typeof map]
    
    if (typeof proj === "string") {
      //@ts-expect-error
      if (proj === key)
        toKeep.add(key)
      else {
        const pre = renames[proj]
        
        if (pre === undefined)
          renames[proj] = key
        else if (isArray(pre))
          pre.push(key)
        else
          renames[proj] = [pre, key]
      }
    } else if (proj)
      //@ts-expect-error
      toKeep.add(key)
  }

  for (const key in base) {
    const rename = renames[key]

    if (rename !== undefined) {
      if (!isArray(rename))
        //@ts-expect-error
        target[rename] = base[key]

      else {
        const value = base[key]
        , {length} = rename
  
        //@ts-expect-error
        toKeep.has(key) || delete target[key]
  
        for (let i = 0; i < length; i++)
          //@ts-expect-error
          target[rename[i]] = value
      }
    }

    if (!toKeep.has(key))
      //@ts-expect-error
      delete target[key]
  }
    
  return target
}
