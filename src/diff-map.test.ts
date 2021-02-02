import diffMap, {DiffStatus} from "./diff-map";

const {ADDED, DELETED, MODIFIED} = DiffStatus

it("scalar", () => expect(diffMap<string|number>("1", 1)).toBe(MODIFIED))

it("flat object", () => expect(diffMap(
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