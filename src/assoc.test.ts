import { $get, $set, $size, sizeObject } from "./assoc";
import type { Dict } from "./ts-swiss.types";

describe(sizeObject.name, () => {
  it("Pure", () => expect(sizeObject(
  )).toStrictEqual(
    {}
  ))
  
  it("Empty object", () => expect(sizeObject(
    {}
  )).toStrictEqual(
    {}
  ))
})

describe($size.name, () => {
  it("Object", () => expect($size(
    {"a": 1}
  )).toBe(1))

  it("Sized", () => expect($size(sizeObject(
    {"a": 1}
  ))).toBe(1))
})

it($set.name, () => {
  const value = {}

  expect($set({}, "a", value)).toBe(value)
  expect($set(new Map(), "a", value)).toBe(value)
})

it($get.name, () => {
  const sources = [{} as Dict<{}>, new Map<string, {}>()]
  , value = {}

  expect($get(sources[0], "a")).toBe(undefined)
  expect($get(sources[1], "a")).toBe(undefined)

  sources.forEach(s => $set(s, "a", value))

  expect($get(sources[0], "a")).toBe(value)
  expect($get(sources[1], "a")).toBe(value)
})