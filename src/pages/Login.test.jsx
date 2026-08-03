import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { AuthProvider } from "../contexts/AuthContext";
import useAuth from "../hooks/useAuth";

jest.mock("../hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form", () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
  });

  test("user types into login form", async () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);

    await userEvent.type(emailInput, "user@example.com");
    await userEvent.type(passwordInput, "secret123");

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("secret123");
  });

  test("login validation", async () => {
    useAuth.mockReturnValue({ login: jest.fn() });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
