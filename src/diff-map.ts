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
    , result = [] as DiffShape<T> & unknown[]

    for (let i = 0; i < length; i++) {
      const { removed, added, count = 1} = statuses[i]
      , { removed: nextRemoved, added: nextAdded, count: nextCount = 1} = statuses[i + 1] ?? {}
      , status = diff2status(added, removed)
      , nextStatus = diff2status(nextAdded, nextRemoved)

      // Was against count
      // let count = 1
      // // Last "\n" is lines delimiter
      // for (let i = value.length - 1; i--;)
      //   if (value[i] === "\n")
      //     count++

      if (!(
        status === DELETED && nextStatus === ADDED
        || status === ADDED && nextStatus === DELETED
      ))
        pushRepeat(result, count, status)
      else {
        i++
        count > nextCount && pushRepeat(result, count - nextCount, status)
        pushRepeat(result, count > nextCount ? nextCount : count, MODIFIED)
        count < nextCount && pushRepeat(result, nextCount - count, nextStatus)
      }
        
      
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

function diff2status(added: boolean|undefined, removed: boolean|undefined) {
  return removed 
  ? DELETED
  : added
  ? ADDED
  : undefined
}

function pushRepeat<T>(source: T[], length: number, item: T) {
  return source.push(...new Array(length).fill(item))
}