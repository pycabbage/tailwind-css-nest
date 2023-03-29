import { dist } from ".";

describe("tailwind extended syntax", () => {
  test("distribute", () => {
    expect(dist`apple:{ banana }`).toBe("apple:banana")
    expect(dist`apple*banana:{ candy }`).toBe("apple:candy banana:candy")
  })
})
