import type { IfSame } from "./ts-swiss.types";

export {
  tsIsSame
};

function tsIsSame<T1, T2>(_: IfSame<T1, T2, true, T1>, _1?: T1, _2?: T2) {}

it("", () => {})
