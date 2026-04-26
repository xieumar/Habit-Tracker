import "@testing-library/jest-dom";
import { afterEach, beforeEach } from "vitest";

beforeEach(() => {
  // Mock crypto.randomUUID if not present
  if (typeof crypto === "undefined") {
    (global as any).crypto = {
      randomUUID: () => "test-uuid-" + Math.random(),
    };
  } else if (!crypto.randomUUID) {
    (crypto as any).randomUUID = () => "test-uuid-" + Math.random();
  }

  // Clear localStorage before each test
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
  }
});

afterEach(() => {
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
  }
});