import "@testing-library/jest-dom";
import { afterEach, beforeEach } from "vitest";

beforeEach(() => {
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