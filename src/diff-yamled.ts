import {diffLines} from "diff"
//TODO compare with `yaml`
import {
  dump,
  load as parse,
  DEFAULT_SCHEMA
} from "js-yaml"

const schema = DEFAULT_SCHEMA.extend(require("js-yaml-js-types/undefined"));

export default deepDiff

const stringify = (o: unknown) => dump(o, {
  lineWidth: Infinity,
  noCompatMode: true,
  quotingType: "\"",
  forceQuotes: true
})

function deepDiff<T>(o1: T, o2: T) {
  const result = diffLines(
    stringify(o1),
    stringify(o2),
    {
      newlineIsToken: true
    }
  )

  const preStr = []
  , curStr = []

  for (const chunk of result) {
    const {
      value,
      added,
      // count,
      removed
    } = chunk

    if (!added)
      preStr.push(value)
    
    if (!removed)
      curStr.push(value)
    
    if (!added && !removed)
      continue

    const nulled = value.split("\n")
    .map(str => str.replace(/(false|true|[0-9]+|"[^"]*")$/, "!!js/undefined ''"))
    .join("\n")

    ;(removed ? curStr : preStr).push(nulled)
  }

  return [
    preStr,
    curStr
  ]
  .map(x => parse(x.join("\n"), {schema})) as [T[], T[]]
}