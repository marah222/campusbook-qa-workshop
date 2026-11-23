import { describe, test, expect } from "vitest";
import { meetsCapacity } from "../../../src/domain/rooms.ts";

describe("meetsCapacity", () => {
  // test("meetsCapacity_BelowCapacity_ShouldReturnFalse", () => {
  //   const roomCapacity = 30;
  //   const requestedPeople = 45;

  //   const acual = meetsCapacity(roomCapacity, requestedPeople);

  //   expect(acual).toBe(false);
  // });

  test.each([
    {
      capcity: 30,
      people: 45,
      expected: false,
      scenario: "LessThan_ShouldReturnFalse",
    },
    {
      capcity: 45,
      people: 30,
      expected: true,
      scenario: "GreaterThan_ShouldReturnTrue",
    },
    {
      capcity: 30,
      people: 30,
      expected: true,
      scenario: "Equal_ShouldReturnTrue",
    },
  ])("meetsCapacity_$scenario", ({ capcity, people, expected }) => {
    const actual = meetsCapacity(capcity, people);

    expect(actual).toBe(expected);
  });
});
