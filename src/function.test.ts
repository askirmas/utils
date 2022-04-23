import {
  deanon,
  idfn,
  nop,
  renameFn
} from "./function";

describe(renameFn.name, () => {
  it("anon", () => expect(renameFn(
    "renamed",
    () => {}
  ).name).toBe("renamed"))

  it("named", () => expect(renameFn(
    "renamed",
    function named() {}
  ).name).toBe("renamed"))
})

describe(deanon.name, () => {
  it("anon", () => expect(deanon(
    "renamed",
    () => {}
  ).name).toBe("renamed"))

  it("named", () => expect(deanon(
    "renamed",
    function named() {}
  ).name).toBe("named"))
})

it(nop.name, () => expect(nop(1)).toBe(undefined))

it(idfn.name, () => {
  const x = {}
  expect(idfn(x)).toBe(x)
})
