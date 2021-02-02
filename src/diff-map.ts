const {isArray: $isArray} = Array

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
  
  if ($isArray(current) || $isArray(previous))
    return MODIFIED

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