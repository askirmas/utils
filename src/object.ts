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

function project<S,
  Pick extends {[s in keyof S]?: 1|true},
  Omit extends {[s in keyof S]?: 0|false|null|undefined},
  Rename extends {[k: string]: keyof S}
  >(base: S, map: Pick & Omit) {
  const target = base as unknown as {
    [k in keyof Pick & keyof Rename]:
      k extends Extract<keyof Pick, keyof S> ? S[k]
      : k extends keyof Rename ? S[Rename[k]] 
      : never
  }
  , toKeep = new Set<string>()
  , renames: Dict<string | string[]> = {}
  
  for (const key in map) {
    const proj = map[key as keyof typeof map]
    
    if (typeof proj === "string") {
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
  
        toKeep.has(key) || delete target[key]
  
        for (let i = 0; i < length; i++)
          //@ts-expect-error
          target[rename[i]] = value
      }
    }

    if (!toKeep.has(key))
      delete target[key]
  }
    
  return target
}
