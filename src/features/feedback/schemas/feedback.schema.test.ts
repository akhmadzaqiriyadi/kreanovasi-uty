import { expect, test } from "bun:test";
import { feedbackSchema } from "./feedback.schema";

test("feedbackSchema validates correct inputs", () => {
  const validData = {
    name: "John Doe",
    email: "john@example.com",
    message: "This is a great template!",
  };

  const result = feedbackSchema.safeParse(validData);
  expect(result.success).toBe(true);
});

test("feedbackSchema validates correct inputs with empty message", () => {
  const validData = {
    name: "John Doe",
    email: "john@example.com",
    message: "",
  };

  const result = feedbackSchema.safeParse(validData);
  expect(result.success).toBe(true);
});

test("feedbackSchema rejects too short names", () => {
  const invalidData = {
    name: "J",
    email: "john@example.com",
    message: "Hello",
  };

  const result = feedbackSchema.safeParse(invalidData);
  expect(result.success).toBe(false);
  if (!result.success) {
    const issues = result.error.issues;
    expect(issues[0].message).toBe("Name must be at least 2 characters long");
  }
});

test("feedbackSchema rejects invalid emails", () => {
  const invalidData = {
    name: "John Doe",
    email: "not-an-email",
    message: "Hello",
  };

  const result = feedbackSchema.safeParse(invalidData);
  expect(result.success).toBe(false);
  if (!result.success) {
    const issues = result.error.issues;
    expect(issues[0].message).toBe("Invalid email address format");
  }
});
