import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getSession, getUsers } from "@/lib/storage";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

// Import components after mocks
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
});

describe("auth flow", () => {
  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "alice@example.com"
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    // Session should be saved
    const session = getSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe("alice@example.com");

    // User should be saved
    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("alice@example.com");

    // Should redirect to dashboard
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    // First signup
    render(<SignupForm />);
    await user.type(
      screen.getByTestId("auth-signup-email"),
      "alice@example.com"
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    // Second signup with same email
    render(<SignupForm />);
    await user.type(
      screen.getAllByTestId("auth-signup-email")[1],
      "alice@example.com"
    );
    await user.type(
      screen.getAllByTestId("auth-signup-password")[1],
      "otherpassword"
    );
    await user.click(screen.getAllByTestId("auth-signup-submit")[1]);

    expect(await screen.findByText("User already exists")).toBeInTheDocument();
  });

 it("submits the signup form and creates a session", async () => {
  const user = userEvent.setup();
  render(<SignupForm />);

  await user.type(screen.getByTestId("auth-signup-email"), "alice@example.com");
  await user.type(screen.getByTestId("auth-signup-password"), "password123");
  await user.click(screen.getByTestId("auth-signup-submit"));

  // Wait for the async submission to complete
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  const session = getSession();
  expect(session).not.toBeNull();
  expect(session?.email).toBe("alice@example.com");

  const users = getUsers();
  expect(users).toHaveLength(1);
  expect(users[0].email).toBe("alice@example.com");
}, 10000);

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "nobody@example.com"
    );
    await user.type(screen.getByTestId("auth-login-password"), "wrongpassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(
      await screen.findByText("Invalid email or password")
    ).toBeInTheDocument();
  });
});