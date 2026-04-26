import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

it("renders a simple component", () => {
  render(<div>Hello World</div>);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});
