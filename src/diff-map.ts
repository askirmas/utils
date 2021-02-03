import {diffLines} from "diff"

const {isArray: $isArray} = Array
, {stringify: $stringify} = JSON

type DiffShape<T> = DiffStatus | {[P in keyof T]?: DiffShape<T[P]>}

enum DiffStatus {MODIFIED, ADDED, DELETED}

const {MODIFIED, ADDED, DELETED} = DiffStatus
, SAME = undefined

export default diffMap
export {
  DiffStatus
}

function diffMap<T>(current: T, previous: T) :DiffShape<T> | undefined {
  if (current === previous)
    return SAME
  if (previous === undefined)
    return ADDED
  if (current === undefined)
    return DELETED

  if (
    current === null || typeof current !== "object"
    || previous === null || typeof previous !== "object"
  )
    return MODIFIED
  
  if ($isArray(current) !== $isArray(previous)) {
    return MODIFIED
  }

  if ($isArray(current)) {
    //@ts-ignore
    const statuses = diffLines(arrToJsonLines(previous), arrToJsonLines(current))
    , {length} = statuses
    //TODO `new Array(Math.max)`
    , result = []

    for (let i = 0; i < length; i++) {
      const { value, removed, added } = statuses[i]

      let len = 1
      // Last "\n" is lines delimiter
      for (let i = value.length - 1; i--;)
        if (value[i] === "\n")
          len++
      
      result.push(...new Array(len).fill(
        removed 
        ? DELETED
        : added
        ? ADDED
        : undefined,      
      ))
    }
    return result
  }
    

  const result: DiffShape<T> = {}
  let same = true

  for (let key in current) {
    const res = diffMap(current[key], previous[key])
    
    if (res === SAME)
      continue
      
    same && (same = false)
    result[key] = res
  }
    
  for (let key in previous)
    if (previous[key] !== undefined && current[key] === undefined) {
      same && (same = false)
      result[key] = DELETED
    }

  return same ? SAME : result
}

function arrToJsonLines<T>(arr: T[]) {
  return arr
  .map(x => x === undefined ? x : $stringify(x))
  .join("\n")
}