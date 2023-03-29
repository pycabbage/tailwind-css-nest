import { nest } from ".";

describe("tailwind extended syntax", () => {
  test("distribute", () => {
    expect(nest`apple:{ banana }`).toBe("apple:banana")
    expect(nest`apple*banana:{ candy }`).toBe("apple:candy banana:candy")
  })
})
