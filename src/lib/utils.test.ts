import { expect, test } from "bun:test";
import { cn } from "./utils";

test("cn merges tailwind classes correctly", () => {
  expect(cn("px-2 py-2", "p-4")).toBe("p-4");
  expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  expect(cn("bg-red-500", "text-white", "hover:bg-red-600")).toBe(
    "bg-red-500 text-white hover:bg-red-600",
  );
});
