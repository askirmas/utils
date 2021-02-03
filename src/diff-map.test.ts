import diffMap, {DiffStatus} from "./diff-map";

const {ADDED, DELETED, MODIFIED} = DiffStatus

describe("falls", () => {
  it("undefined source", () => expect(diffMap(undefined, 1)).toBe(DELETED))
  it("obj vs array", () => expect(diffMap([], {})).toBe(MODIFIED))
})

it("scalar", () => expect(diffMap<string|number>("1", 1)).toBe(MODIFIED))

describe("flat object", () => {
  it("demo", () => expect(diffMap(
    {
      "modified__type": 1,
      "added__bool": true,
      "same__string": "same__string"
    },
    {
      "modified__type": "1",
      "deleted__null": null,
      "same__string": "same__string"
    }
  )).toStrictEqual({
    "modified__type": MODIFIED,
    "added__bool": ADDED,
    "deleted__null": DELETED
  }))

  it("undefined changes", () => expect(diffMap(
    {
      "same": "same"
    },
    {
      "same": "same",
      "undefined": undefined
    }
  )).toStrictEqual(
    undefined
  ))

  describe("only deletions", () => {
    it("Wrong", () => expect(diffMap(
      {
        "same": "same"
      },
      {
        "same": "same",
        "deleted": "deleted"
      }
    )).toStrictEqual(
      {
        "deleted": DELETED
      }
    ))
  })
})


describe("scalar array", () => {
  it("some", () => expect(diffMap(
    ["added", "same1"  ,            "same3"  , "modified-1", "added"],
    [         "same1"  , "deleted", "same3"  , "modified-2"]
  )).toStrictEqual(
    [ADDED  , undefined, DELETED  , undefined, MODIFIED     ,  ADDED ]
  ))

  it("-2+1", () => expect(diffMap(
    ["modified-1"],
    ["deleted", "modified-2"]
  )).toStrictEqual(
    [DELETED, MODIFIED]
  ))
})

it("mixed array", () => expect(diffMap(
  [
    "x",
    undefined,
    {"a": "1", "b": 1}
  ],
  [
    {"a": "0", "b": 1},
    undefined,
    {"a": "1", "b": 1}
  ] 

)).toStrictEqual(
  [MODIFIED, undefined,  undefined]
))  
